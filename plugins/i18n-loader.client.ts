export default defineNuxtPlugin(async (nuxtApp) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chakana-api.uicgroup.tech'
  const cleanBaseURL = BASE_URL.replace(/\/api\/v1\/?$/, '')

  const fetchTranslations = async (locale: string): Promise<Record<string, string>> => {
    try {
      const fingerprint = document.cookie
        .split('; ')
        .find(row => row.startsWith('fingerprint='))
        ?.split('=')[1] || ''

      const url = `${cleanBaseURL}/api/v1/common/FrontendTranslations/?limit=1000`
      console.log(`[i18n] Fetching translations for "${locale}":`, url)

      const response = await fetch(url, {
        headers: {
          'Accept-Language': locale,
          'Device-Id': fingerprint,
        },
      })

      if (!response.ok) {
        console.error(`[i18n] API error: ${response.status}`)
        return {}
      }

      const data = await response.json()
      console.log(`[i18n] Raw response for "${locale}":`, data)

      let translations: Record<string, string> = {}

      // Формат 1: {results: [{key, text}, ...]}
      if (data?.results && Array.isArray(data.results)) {
        data.results.forEach((item: { key: string; text: string }) => {
          if (item.key && item.text) {
            translations[item.key] = item.text
          }
        })
      }
      // Формат 2: прямой объект {key: value, ...}
      else if (typeof data === 'object' && data !== null) {
        // Фильтруем служебные поля (count, next, previous)
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'string' && !['count', 'next', 'previous'].includes(key)) {
            translations[key] = value
          }
        })
      }

      console.log(`[i18n] Parsed ${Object.keys(translations).length} translations for "${locale}"`)
      return translations
    } catch (error) {
      console.error(`[i18n] Failed to fetch translations for "${locale}":`, error)
      return {}
    }
  }

  // Ждём пока i18n будет готов
  nuxtApp.hook('app:mounted', async () => {
    const i18n = nuxtApp.$i18n as any
    
    if (!i18n) {
      console.error('[i18n] i18n instance not found')
      return
    }

    // Получаем текущую локаль
    const currentLocale = i18n.locale?.value || i18n.locale || 'uz'
    console.log(`[i18n] Current locale: ${currentLocale}`)

    // Загружаем переводы
    const translations = await fetchTranslations(currentLocale)

    if (Object.keys(translations).length > 0) {
      // Мержим с существующими переводами
      const existingMessages = i18n.getLocaleMessage?.(currentLocale) || {}
      const mergedMessages = { ...existingMessages, ...translations }
      
      // Устанавливаем переводы
      if (typeof i18n.setLocaleMessage === 'function') {
        i18n.setLocaleMessage(currentLocale, mergedMessages)
        console.log(`[i18n] ✅ Translations applied for "${currentLocale}"`)
        console.log(`[i18n] Sample keys:`, Object.keys(translations).slice(0, 5))
      } else if (i18n.global?.setLocaleMessage) {
        i18n.global.setLocaleMessage(currentLocale, mergedMessages)
        console.log(`[i18n] ✅ Translations applied via global for "${currentLocale}"`)
      } else {
        console.error('[i18n] setLocaleMessage method not found')
        console.log('[i18n] i18n methods:', Object.keys(i18n))
      }
    }
  })

  // Также загружаем при смене языка
  nuxtApp.hook('i18n:localeSwitched', async ({ newLocale }: { newLocale: string }) => {
    console.log(`[i18n] Locale switched to: ${newLocale}`)
    const i18n = nuxtApp.$i18n as any
    
    if (i18n) {
      const translations = await fetchTranslations(newLocale)
      if (Object.keys(translations).length > 0) {
        const existingMessages = i18n.getLocaleMessage?.(newLocale) || {}
        const mergedMessages = { ...existingMessages, ...translations }
        
        if (typeof i18n.setLocaleMessage === 'function') {
          i18n.setLocaleMessage(newLocale, mergedMessages)
          console.log(`[i18n] ✅ Translations applied for "${newLocale}" after switch`)
        } else if (i18n.global?.setLocaleMessage) {
          i18n.global.setLocaleMessage(newLocale, mergedMessages)
        }
      }
    }
  })

  return {
    provide: {
      reloadTranslations: async (locale?: string) => {
        const i18n = nuxtApp.$i18n as any
        const targetLocale = locale || i18n?.locale?.value || 'uz'
        const translations = await fetchTranslations(targetLocale)
        
        if (Object.keys(translations).length > 0 && i18n) {
          const existingMessages = i18n.getLocaleMessage?.(targetLocale) || {}
          const mergedMessages = { ...existingMessages, ...translations }
          
          if (typeof i18n.setLocaleMessage === 'function') {
            i18n.setLocaleMessage(targetLocale, mergedMessages)
          } else if (i18n.global?.setLocaleMessage) {
            i18n.global.setLocaleMessage(targetLocale, mergedMessages)
          }
        }
        return translations
      }
    }
  }
})
