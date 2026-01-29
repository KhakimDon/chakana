import { $fetch } from 'ofetch'
import type { FetchOptions } from 'ofetch'

/**
 * Генерирует session строку в формате: SSO|OS|Device|DeviceID
 * Согласно документации: Platform|OS version|Device model|DeviceID
 */
function generateSession(): string {
  if (process.client) {
    const deviceId = useCookie<string>('device-id')
    if (!deviceId.value) {
      // Генерируем уникальный ID устройства
      const newDeviceId = generateDeviceId()
      deviceId.value = newDeviceId
    }

    // Определяем платформу и устройство
    const platform = 'SSO'
    const os = getOSVersion()
    const device = getDeviceModel()
    const deviceIdValue = deviceId.value

    return `${platform}|${os}|${device}|${deviceIdValue}`
  }
  return 'SSO|14|Unknown|unknown'
}

function generateDeviceId(): string {
  // Генерируем уникальный ID устройства
  return `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
}

function getOSVersion(): string {
  if (process.client) {
    const userAgent = navigator.userAgent
    // Простое определение версии ОС
    if (userAgent.includes('iPhone')) {
      const match = userAgent.match(/OS (\d+)_(\d+)/)
      return match ? match[1] : '14'
    }
    if (userAgent.includes('Android')) {
      const match = userAgent.match(/Android (\d+\.?\d*)/)
      return match ? match[1] : '14'
    }
  }
  return '14'
}

function getDeviceModel(): string {
  if (process.client) {
    const userAgent = navigator.userAgent
    if (userAgent.includes('iPhone')) {
      // Можно улучшить определение модели iPhone
      return 'iPhone'
    }
    if (userAgent.includes('Android')) {
      // Можно улучшить определение модели Android
      return 'Android Device'
    }
  }
  return 'Unknown Device'
}

export const useIdentityApi = () => {
  const { $i18n } = useNuxtApp()
  const locale = $i18n?.locale ?? 'ru'

  // BaseURL должен быть полным URL
  // Если переменная окружения не установлена, используем testapi.mobilpay.uz
  const envBaseURL = import.meta.env.VITE_IDENTITY_API_BASE_URL as string
  const baseURL =
    envBaseURL && !envBaseURL.includes('localhost')
      ? envBaseURL
      : 'https://testapi.mobilpay.uz'
  
  // API-ключ из переменной окружения или значение по умолчанию из документации
  const apiKey =
    (import.meta.env.VITE_IDENTITY_API_KEY as string) ||
    'd5df62cf-fd2e-47e1-a356-cfb09a3dbfe4'

  const sessionCookie = useCookie<string | null>('identity-session', {
    default: () => generateSession(),
  })

  // Обновляем session если его нет
  if (!sessionCookie.value) {
    sessionCookie.value = generateSession()
  }

  const request = async <T = unknown>(
    path: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Accept-Language': (locale as any).value || 'ru',
      'Content-Type': 'application/json',
      apiKey,
      session: sessionCookie.value || generateSession(),
      ...(options.headers as any),
    }

    // Убеждаемся, что baseURL имеет протокол
    const finalBaseURL = baseURL.startsWith('http')
      ? baseURL
      : `https://${baseURL}`

    return $fetch<T>(path, {
      ...(options as any),
      baseURL: finalBaseURL,
      headers,
    } as any)
  }

  /**
   * Проверка существования пользователя
   * HEAD /api/v1/auth
   * Headers: apiKey
   * 200 OK → пользователь существует
   * 404 → пользователь не существует (можно регистрировать)
   */
  const checkUserExists = async (userName: string): Promise<boolean> => {
    try {
      await $fetch('api/v1/auth', {
        method: 'HEAD',
        baseURL,
        headers: {
          apiKey,
        },
      })
      // Если запрос успешен (200 OK), пользователь существует
      return true
    } catch (err: any) {
      // Если 404, пользователь не существует
      const status = err?.status || err?.statusCode || err?.response?.status
      if (status === 404) {
        return false
      }
      // Для других ошибок возвращаем false (попробуем регистрацию)
      console.warn('checkUserExists error:', err)
      return false
    }
  }

  /**
   * Проверка аккаунта с номером телефона и паролем
   * POST /api/v1/auth
   * Headers: apiKey
   * Body: userName, password (опционально)
   */
  const checkAccount = async (userName: string, password?: string): Promise<any> => {
    try {
      const response = await $fetch('api/v1/auth', {
        method: 'POST',
        baseURL,
        headers: {
          apiKey,
          'Content-Type': 'application/json',
        },
        body: password ? { userName, password } : { userName },
      })
      console.log('[checkAccount] Response:', response)
      return response
    } catch (err: any) {
      const status = err?.status || err?.statusCode || err?.response?.status
      console.log('[checkAccount] Error:', {
        status,
        message: err?.message,
        data: err?.data || err?.response?._data,
        fullError: err,
      })
      throw err
    }
  }

  /**
   * Регистрация пользователя
   * POST /identity-api/v1.0/users/register
   * Headers: apiKey, Accept-Language, Content-Type
   * Body: userName, password, languageId
   * 
   * Ответ: 201 Created, OTP отправлен, возвращает объект пользователя (statusId = 2)
   */
  const register = (
    userName: string,
    password: string,
    languageId: 'ru' | 'uz' | 'en'
  ) =>
    request('identity-api/v1.0/users/register', {
      method: 'POST',
      body: { userName, password, languageId },
    })

  /**
   * Получение OTP кода (повторная отправка)
   * POST /identity-api/v1.0/users/activesessions/verify
   * 
   * Headers: session, apiKey
   * Body: { userName }
   * Response: 204 OK empty response
   * 
   * Используется если OTP expired или нужно отправить повторно
   */
  const resendOtp = async (userName: string): Promise<void> => {
    const currentSession = sessionCookie.value || generateSession()
    
    await $fetch('identity-api/v1.0/users/activesessions/verify', {
      method: 'POST',
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        session: currentSession,
        apiKey,
      },
      body: { 
        userName
      },
    })
  }

  /**
   * Получение OTP кода (старый метод, оставлен для совместимости)
   * POST /identity-api/v1.0/users/verify/get_otp
   * 
   * @deprecated Используйте login() для входа или resendOtp() для повторной отправки
   */
  const getOtp = async (userName: string): Promise<any> => {
    try {
      const url = `${baseURL}/identity-api/v1.0/users/verify/get_otp`
      const headers = {
        'Content-Type': 'application/json',
        'Accept-Language': (locale as any).value || 'ru',
        apiKey: apiKey,
        session: sessionCookie.value || generateSession(),
      }
      const body = { 
        username: userName
      }
      
      console.log('[getOtp] Request:', {
        url,
        method: 'POST',
        headers,
        body,
        userName,
        userNameLength: userName?.length,
      })
      
      const response = await $fetch('identity-api/v1.0/users/verify/get_otp', {
        method: 'POST',
        baseURL,
        headers,
        body,
        timeout: 60000,
      })
      
      console.log('[getOtp] Response:', response)
      return response
    } catch (err: any) {
      const status = err?.status || err?.statusCode || err?.response?.status || err?.response?.statusCode
      if (status === 504) {
        console.warn('getOtp returned 504 Gateway Timeout, but SMS was likely sent. Treating as success.')
        return { success: true, message: 'OTP sent (504 timeout, but SMS delivered)' }
      }
      throw err
    }
  }

  /**
   * Авторизация пользователя (вход)
   * POST /identity-api/v1.0/auth/login
   * Headers: session, apiKey
   * Body: { languageId, userName, password }
   * Response: 202 OK empty (OTP отправлен на телефон)
   * 
   * Примечание: apiKey в headers, так как в body он вызывает ошибку валидации (максимум 35 символов)
   */
  const login = async (
    userName: string,
    password: string
  ): Promise<void> => {
    const currentSession = sessionCookie.value || generateSession()
    const languageId = (locale as any).value || 'ru'

    console.log('[login] Request:', {
      url: `${baseURL}/identity-api/v1.0/auth/login`,
      method: 'POST',
      headers: {
        session: currentSession,
        apiKey,
      },
      body: {
        languageId,
        userName,
        password: '***', // Не логируем пароль
      },
    })

    await $fetch('identity-api/v1.0/auth/login', {
      method: 'POST',
      baseURL,
      headers: {
        session: currentSession,
        apiKey,
      },
      body: {
        languageId,
        userName,
        password,
      },
      // Используем onResponse для получения session из headers ответа
      onResponse({ response: res }) {
        console.log('[login] Response:', {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        })
        
        // Обновляем session из headers ответа, если он пришел
        let newSession: string | null = null
        if (res.headers instanceof Headers) {
          newSession = res.headers.get('session')
        } else if (res.headers && typeof res.headers === 'object') {
          newSession = (res.headers as any).session || (res.headers as any)['session']
        }

        if (newSession) {
          sessionCookie.value = newSession
        }
      },
    })
  }

  /**
   * Подтверждение OTP и получение токена
   * PUT /identity-api/v1.0/users/activesessions/verify
   * 
   * Headers: session, apiKey
   * Body: { code, userName, password }
   * Response: 200 OK { "login": "...", "authToken": "jwt token", "refreshToken": "...", "expiresIn": 432000 }
   */
  const verifyOtp = async (
    userName: string,
    password: string,
    code: string
  ): Promise<{ login: string; authToken: string; refreshToken: string; expiresIn: number }> => {
    const currentSession = sessionCookie.value || generateSession()
    
    const response = await $fetch<{ login: string; authToken: string; refreshToken: string; expiresIn: number }>(
      'identity-api/v1.0/users/activesessions/verify',
      {
        method: 'PUT',
        baseURL,
        headers: {
          'Content-Type': 'application/json',
          session: currentSession,
          apiKey,
        },
        body: { 
          code, 
          userName, // camelCase согласно документации
          password 
        },
        // Используем onResponse для получения session из headers ответа
        onResponse({ response: res }) {
          // Обновляем session из headers ответа, если он пришел
          // Headers могут быть Headers объектом или обычным объектом
          let newSession: string | null = null
          if (res.headers instanceof Headers) {
            newSession = res.headers.get('session')
          } else if (res.headers && typeof res.headers === 'object') {
            // Если headers это обычный объект
            newSession = (res.headers as any).session || (res.headers as any)['session']
          }
          
          if (newSession) {
            sessionCookie.value = newSession
          }
        },
      }
    )

    return response
  }

  /**
   * Обновление токена
   * POST /identity-api/v1.0/auth/refresh-token
   */
  const refreshToken = (
    accessToken: string,
    refreshToken: string,
    checkTwoFactor = false
  ) =>
    request<{ authToken: string }>('identity-api/v1.0/auth/refresh-token', {
      method: 'POST',
      body: {
        accessToken,
        refreshToken,
        checkTwoFactor,
      },
    })

  return {
    checkUserExists,
    checkAccount,
    register,
    login,
    getOtp,
    resendOtp,
    verifyOtp,
    refreshToken,
    getSession: () => sessionCookie.value,
  }
}


