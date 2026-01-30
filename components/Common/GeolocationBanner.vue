<template>
  <Transition name="slide-down">
    <div v-if="showBanner"
      class="w-full bg-[#ED2024] text-white py-[10px] fixed top-0 left-0 right-0 z-[60]">
      <div class="w-full overflow-hidden">
        <div class="marquee-container flex items-center gap-2 md:gap-[50px]">
          <!-- Дублированный контент для бесконечной прокрутки -->
          <div v-for="i of 9" :key="i" class="marquee-content flex items-center gap-2 md:gap-[50px] shrink-0">
            <!-- Иконка -->
            <div class="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle opacity="0.4" cx="14" cy="14" r="5.75" stroke="white" stroke-width="0.5" />
                <g opacity="0.6" filter="url(#filter0_f_253_11940)">
                  <circle cx="14" cy="14" r="4" fill="white" />
                </g>
                <circle cx="14" cy="14" r="4" fill="white" />
                <defs>
                  <filter id="filter0_f_253_11940" x="0" y="0" width="28" height="28" filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_253_11940" />
                  </filter>
                </defs>
              </svg>
            </div>
            <!-- Текст -->
            <p class="text-xs md:text-[13px] font-medium leading-130 whitespace-nowrap">
              {{ $t('specify_location_to_display_stores') || 'Укажите местоположение, чтобы отобразить доступные точки на карте!' }}
            </p>
          </div>
          <!-- Дубликат для бесшовной прокрутки -->
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const showBanner = ref(false)
const geolocationPermission = ref<PermissionState | null>(null)

// Экспортируем showBanner для использования в других компонентах
defineExpose({
  showBanner: readonly(showBanner),
})

// Проверяем разрешение на геолокацию
const checkGeolocationPermission = async () => {
  if (!process.client) {
    return
  }

  try {
    // Используем Permissions API если доступен (Chrome, Edge, Firefox)
    if ('permissions' in navigator && 'query' in navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
        geolocationPermission.value = result.state

        // Отслеживаем изменения разрешения
        result.onchange = () => {
          geolocationPermission.value = result.state
          updateBannerVisibility()
        }

        updateBannerVisibility()
        return
      } catch (permError) {
        // Permissions API не поддерживает geolocation или произошла ошибка
        console.log('[GeolocationBanner] Permissions API error, using fallback:', permError)
      }
    }

    // Fallback: проверяем через попытку получения геолокации
    // Используется для Safari и других браузеров без поддержки Permissions API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Успешно получили геолокацию - разрешение дано
          geolocationPermission.value = 'granted'
          updateBannerVisibility()
        },
        (error) => {
          // Ошибка получения геолокации
          if (error.code === error.PERMISSION_DENIED) {
            geolocationPermission.value = 'denied'
          } else {
            // TIMEOUT или POSITION_UNAVAILABLE - считаем как prompt
            geolocationPermission.value = 'prompt'
          }
          updateBannerVisibility()
        },
        {
          timeout: 2000,
          maximumAge: 0 // Не использовать кеш
        }
      )
    } else {
      // Геолокация не поддерживается браузером
      geolocationPermission.value = 'denied'
      updateBannerVisibility()
    }
  } catch (error) {
    console.error('[GeolocationBanner] Error checking permission:', error)
    // В случае ошибки показываем баннер (безопасный вариант)
    geolocationPermission.value = 'prompt'
    updateBannerVisibility()
  }
}

// Обновляем видимость баннера
const updateBannerVisibility = () => {
  // Показываем баннер только если разрешение не дано (prompt или denied)
  // Если разрешение granted - скрываем баннер автоматически
  showBanner.value = geolocationPermission.value !== 'granted' && geolocationPermission.value !== null
}

onMounted(() => {
  // Проверяем разрешение на геолокацию
  checkGeolocationPermission()

  // Периодически проверяем разрешение, чтобы баннер автоматически скрывался при получении доступа
  const checkInterval = setInterval(() => {
    checkGeolocationPermission()
  }, 2000) // Проверяем каждые 2 секунды

  onUnmounted(() => {
    clearInterval(checkInterval)
  })
})

// Отслеживаем изменения разрешения через события
if (process.client) {
  // Слушаем события изменения геолокации
  watch(
    () => geolocationPermission.value,
    () => {
      updateBannerVisibility()
    }
  )
}
</script>

<style scoped>
/* Анимация появления/исчезновения */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
  max-height: 200px;
  opacity: 1;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
}

/* Marquee эффект */
.marquee-container {
  display: flex;
  animation: marquee 30s linear infinite;
  width: fit-content;
}

.marquee-content {
  display: flex;
  align-items: center;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Пауза при наведении (опционально) */
.marquee-container:hover {
  animation-play-state: paused;
}
</style>
