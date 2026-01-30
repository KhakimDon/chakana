<template>
  <div class="max-md:pb-16">
    <!-- Красный баннер геолокации (не fixed, показывается сверху перед header) -->
    <CommonGeolocationBanner ref="bannerRef" />
    
    <WidgetBanner v-if="useMobile('mobile') && !isOpen" />
    <LayoutHeader 
      v-if="useMobile('desktop')" 
      :style="bannerHeight > 0 ? { top: `${bannerHeight}px` } : { top: '0' }"
      class="!fixed bg-white z-50"
    />
    <LayoutHeaderMobile
      v-else
      :style="bannerHeight > 0 ? { top: `${bannerHeight}px` } : { top: '0' }"
      class="fixed bg-white z-50"
      @change="isOpen = $event"
    />
    <div
      :style="bannerHeight > 0 ? { marginTop: `${70 + bannerHeight}px` } : { marginTop: '70px' }"
      class="md:min-h-[calc(100vh-69px)] min-h-[calc(100vh-68px-64px)] py-4 pb-10 md:pb-4"
    >
      <slot />
    </div>
    <LayoutMobileBottomBar v-if="!useMobile('desktop')" />
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const bannerRef = ref<HTMLElement | null>(null)
const bannerHeight = ref(0)

// Отслеживаем высоту баннера
onMounted(() => {
  if (!process.client) return
  
  const updateHeight = () => {
    // Ищем баннер в DOM
    const bannerElement = document.querySelector('[data-geolocation-banner]')
    if (bannerElement) {
      const computedStyle = window.getComputedStyle(bannerElement)
      // Проверяем, виден ли баннер (не скрыт через display: none или высота > 0)
      if (computedStyle.display !== 'none' && bannerElement.clientHeight > 0) {
        bannerHeight.value = bannerElement.clientHeight
      } else {
        bannerHeight.value = 0
      }
    } else {
      bannerHeight.value = 0
    }
  }
  
  // Используем ResizeObserver для отслеживания изменений размера баннера
  let resizeObserver: ResizeObserver | null = null
  let mutationObserver: MutationObserver | null = null
  
  const initObserver = () => {
    const bannerElement = document.querySelector('[data-geolocation-banner]')
    if (bannerElement) {
      resizeObserver = new ResizeObserver(() => {
        updateHeight()
      })
      resizeObserver.observe(bannerElement)
    }
  }
  
  // Наблюдаем за изменениями в DOM для отслеживания появления/исчезновения баннера
  mutationObserver = new MutationObserver(() => {
    updateHeight()
    // Переинициализируем ResizeObserver если баннер появился
    if (document.querySelector('[data-geolocation-banner]') && !resizeObserver) {
      initObserver()
    }
  })
  
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  })
  
  // Проверяем периодически
  const interval = setInterval(updateHeight, 300)
  
  // Инициализируем при монтировании
  updateHeight()
  initObserver()
  
  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    if (mutationObserver) {
      mutationObserver.disconnect()
    }
    clearInterval(interval)
  })
})
</script>
