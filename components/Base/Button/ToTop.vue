<template>
  <transition name="top-button">
    <button
      v-if="y > 100 && useMobile('desktop')"
      class="fixed bottom-10 right-10 rounded-full z-[19]"
      style="box-shadow: inset 0 0 0 2px rgba(95, 58, 252, 0.2)"
      @click="goToTop"
    >
      <svg
        class="progress-circle svg-content"
        width="46"
        height="46"
        viewBox="-1 -1 102 102"
        fill="none"
      >
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          stroke="#ff831b"
          stroke-width="5"
          :style="`transition: stroke-dashoffset 10ms linear 0s; stroke-dasharray: 307.919, 307.919; stroke-dashoffset: ${offset};`"
        ></path>
      </svg>
      <SvgoCommonArrow
        class="icon-arrow-left absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-2xl leading-5 font-bold text-orange"
      />
    </button>
  </transition>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

const offset = ref(0)
const scrollHeight = ref()

function updateDashOffset() {
  // Calculate the new stroke-dashoffset based on scroll position
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight
  const scrollPosition = window.scrollY
  const scrollPercentage = scrollPosition / scrollableHeight
  offset.value = 307.919 - scrollPercentage * 307.919
}

watch(
  () => y.value,
  () => {
    if (process.client) updateDashOffset()
  },
  { immediate: true }
)

const interval = ref()
interval.value = setInterval(() => {
  if (process.client) scrollHeight.value = document.body.scrollHeight
}, 100)

watch(
  () => scrollHeight.value,
  () => {
    if (process.client) updateDashOffset()
  }
)
function goToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style>
@keyframes toTop {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.top-button-enter-active {
  animation: toTop 0.3s ease-in-out;
}
.top-button-leave-active {
  animation: toTop 0.3s ease-in-out reverse;
}
</style>
