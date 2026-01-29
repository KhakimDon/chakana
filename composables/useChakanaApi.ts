import { $fetch } from 'ofetch'
import type { FetchOptions } from 'ofetch'

/**
 * Chakana API для аутентификации
 * Использует эндпоинты из api.json
 */
export const useChakanaApi = () => {
  const { $i18n } = useNuxtApp()
  const locale = $i18n?.locale ?? 'ru'

  // BaseURL для Chakana API
  const envBaseURL = import.meta.env.VITE_API_BASE_URL as string
  let baseURL =
    envBaseURL && !envBaseURL.includes('localhost')
      ? envBaseURL
      : 'https://chakana-api.uicgroup.tech'

  // Убеждаемся, что baseURL имеет протокол
  const finalBaseURL = baseURL.startsWith('http')
    ? baseURL
    : `https://${baseURL}`

  // Убираем /api/v1 из baseURL, если он там есть, чтобы избежать дублирования
  const cleanBaseURL = finalBaseURL.replace(/\/api\/v1\/?$/, '')

  const request = async <T = unknown>(
    path: string, 
    options: FetchOptions = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Accept-Language': (locale as any).value || 'ru',
      'Content-Type': 'application/json',
      ...(options.headers as any),
    }

    // Убираем начальный слеш из path, если он есть
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    // Убираем /api/v1 из начала path, если он там есть
    const finalPath = cleanPath.replace(/^api\/v1\//, '')

    return $fetch<T>(finalPath, {
      ...(options as any),
      baseURL: `${cleanBaseURL}/api/v1`,
      headers,
    } as any)
  }

  /**
   * Отправка SMS кода для входа/регистрации
   * POST /auth/phone/send-sms/
   * 
   * Возвращает session ID для последующей верификации
   */
  const sendSms = async (phoneNumber: string): Promise<{ session: string }> => {
    const response = await request<{ session?: string } | string>('auth/phone/send-sms/', {
      method: 'POST',
      body: {
        phone_number: phoneNumber,
      },
    })
    
    // API может вернуть объект с session или просто строку (UUID)
    if (typeof response === 'string') {
      // Если ответ - строка, это и есть session UUID
      if (!response || response.trim() === '') {
        throw new Error('Session ID not received from server')
      }
      return { session: response }
    }
    
    // Если ответ - объект, ищем поле session
    if (response && typeof response === 'object') {
      // Проверяем разные возможные поля
      const session = (response as any).session || (response as any).session_id || (response as any).id
      
      if (session && typeof session === 'string' && session.trim() !== '') {
        return { session }
      }
    }
    
    // Если session не найден, выбрасываем ошибку
    throw new Error('Session ID not received from server. Response: ' + JSON.stringify(response))
  }

  /**
   * Верификация SMS кода и вход
   * POST /auth/phone/verify/
   * 
   * Возвращает:
   * - 200 OK: Если пользователь существует - JWT токены и данные пользователя
   * - 201 Created: Если пользователь не существует - registration_required: true и session_id
   */
  const verifyPhone = async (
    phoneNumber: string,
    session: string,
    code: string
  ): Promise<
    | {
        success: true
        message: string
        access: string
        refresh: string
        user: any
        registration_required?: false
      }
    | {
        success: true
        message: string
        registration_required: true
        session_id: string
        phone_number: string
      }
  > => {
    // Используем onResponse для обработки разных статус кодов
    let statusCode = 200
    let responseData: any = null

    try {
      const response = await $fetch<{
        success: boolean
        message: string
        access?: string
        refresh?: string
        user?: any
        registration_required?: boolean
        session_id?: string
        phone_number?: string
      }>(`${cleanBaseURL}/api/v1/auth/phone/verify/`, {
        method: 'POST',
        headers: {
          'Accept-Language': (locale as any).value || 'ru',
          'Content-Type': 'application/json',
        },
        body: {
          phone_number: phoneNumber,
          session,
          code,
        },
        onResponse({ response: res }) {
          statusCode = res.status
          responseData = res._data
        },
      })

      // Используем данные из onResponse или из response
      const data = responseData || response

      // Проверяем, нужна ли регистрация (201 Created)
      if (statusCode === 201 || (data.registration_required && data.session_id)) {
        return {
          success: true,
          message: data.message || 'Phone number verified. Please complete registration.',
          registration_required: true,
          session_id: data.session_id,
          phone_number: data.phone_number || phoneNumber,
        }
      }

      // Если есть токены, значит пользователь существует (200 OK)
      if (data.access && data.refresh) {
        return {
          success: true,
          message: data.message || 'Login successful',
          access: data.access,
          refresh: data.refresh,
          user: data.user,
        }
      }

      // Если ни то, ни другое - ошибка
      throw new Error(data.message || 'Invalid response format')
    } catch (err: any) {
      // Если получили ошибку, проверяем данные в ответе
      const errorData = err?.data || err?.response?._data || responseData || err
      
      // Проверяем registration_required в ответе
      if (errorData?.registration_required && errorData?.session_id) {
        return {
          success: true,
          message: errorData.message || 'Phone number verified. Please complete registration.',
          registration_required: true,
          session_id: errorData.session_id,
          phone_number: errorData.phone_number || phoneNumber,
        }
      }
      
      // Если это не registration_required, пробрасываем ошибку дальше
      throw err
    }
  }

  /**
   * Регистрация пользователя
   * POST /auth/register/
   * 
   * Требует:
   * - session_id из verifyPhone
   * - full_name
   * - phone_number
   * - Опционально: instagram_link, telegram_link, avatar
   */
  const register = async (
    sessionId: string,
    phoneNumber: string,
    fullName: string,
    code: string,
    instagramLink?: string,
    telegramLink?: string,
    avatar?: string
  ): Promise<{
    success: boolean
    access?: string
    refresh?: string
    message?: string
  }> => {
    return request('auth/register/', {
      method: 'POST',
      body: {
        session: sessionId,
        phone_number: phoneNumber,
        full_name: fullName,
        code,
        ...(instagramLink && { instagram_link: instagramLink }),
        ...(telegramLink && { telegram_link: telegramLink }),
        ...(avatar && { avatar }),
      },
    })
  }

  /**
   * Вход с username/password (legacy)
   * POST /auth/login/
   */
  const login = async (
    username: string,
    password: string
  ): Promise<{
    access: string
    refresh: string
    user: any
  }> => {
    return request('auth/login/', {
      method: 'POST',
      body: {
        username,
        password,
      },
    })
  }

  /**
   * Обновление JWT токена
   * POST /auth/refresh/
   */
  const refreshToken = async (
    refreshToken: string
  ): Promise<{
    access: string
  }> => {
    return request('auth/refresh/', {
      method: 'POST',
      body: {
        refresh: refreshToken,
      },
    })
  }

  /**
   * GET запрос к API
   */
  const $get = async <T = unknown>(path: string, options: FetchOptions = {}): Promise<T> => {
    return request<T>(path, { ...options, method: 'GET' })
  }

  /**
   * POST запрос к API
   */
  const $post = async <T = unknown>(path: string, body?: any, options: FetchOptions = {}): Promise<T> => {
    return request<T>(path, { ...options, method: 'POST', body })
  }

  return {
    $get,
    $post,
    request,
    sendSms,
    verifyPhone,
    register,
    login,
    refreshToken,
  }
}
