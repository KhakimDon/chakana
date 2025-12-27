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

  // BaseURL должен быть полным URL, например: https://develop.mobilpay.uz
  // Если переменная окружения не установлена или содержит localhost, используем значение по умолчанию
  const envBaseURL = import.meta.env.VITE_IDENTITY_API_BASE_URL as string
  const baseURL =
    envBaseURL && !envBaseURL.includes('localhost')
      ? envBaseURL
      : 'https://develop.mobilpay.uz'
  
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
   * Согласно документации: "Перед процедурой регистрации, необходимо проверить, есть ли этот пользователь уже в базе с помощью метода HEAD /api/v1/auth"
   */
  const checkUserExists = async (userName: string): Promise<boolean> => {
    try {
      await request('api/v1/auth', {
        method: 'HEAD',
        headers: {
          userName,
        },
      })
      // Если запрос успешен (не выбросил ошибку), пользователь существует
      return true
    } catch (err: any) {
      // Если 404, пользователь не существует
      if (err?.status === 404 || err?.statusCode === 404) {
        return false
      }
      // Другие ошибки пробрасываем дальше
      throw err
    }
  }

  /**
   * Регистрация пользователя
   * POST /identity-api/v1.0/users/register
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
   * Получение OTP кода
   * POST /identity-api/v1.0/users/verify/get_otp
   */
  const getOtp = (userName: string) =>
    request('identity-api/v1.0/users/verify/get_otp', {
      method: 'POST',
      body: { username: userName },
    })

  /**
   * Подтверждение OTP и получение токена
   * PUT /identity-api/v1.0/users/verify/verify_otp
   * Возвращает JWT токен в body и session в headers
   */
  const verifyOtp = async (
    userName: string,
    password: string,
    code: string
  ): Promise<string> => {
    const response = await $fetch<string>(
      'identity-api/v1.0/users/verify/verify_otp',
      {
        method: 'PUT',
        baseURL,
        headers: {
          'Accept-Language': (locale as any).value || 'ru',
          'Content-Type': 'application/json',
          apiKey,
          session: sessionCookie.value || generateSession(),
        },
        body: { username: userName, password, code },
      }
    )

    // Обновляем session из headers ответа, если он пришел
    // В документации указано что session приходит в headers ответа
    // Но так как $fetch не возвращает headers напрямую, используем другой подход
    // Если нужно, можно использовать raw response

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
    register,
    getOtp,
    verifyOtp,
    refreshToken,
    getSession: () => sessionCookie.value,
  }
}


