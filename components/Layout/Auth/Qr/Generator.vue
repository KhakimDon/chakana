<template>
  <div class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="">
        <i class="k-transition absolute-center-h absolute-center-v">
          <svg class="w-[50px] h-[50px]" viewBox="25 25 50 50">
            <circle
              class="qr-loader__path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
            />
          </svg>
        </i>
      </div>
      <QRCanvas
        v-else
        v-bind="{ options }"
        :style="{ width: size + 'px', height: size + 'px' }"
        :class="qrClass"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { QRCanvas } from 'qrcanvas-vue'

interface Props {
  text: string
  margin?: number
  loading?: boolean
  size?: number
  qrClass?: string
  optionsQr?: any
  noImage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  size: 163,
})

const options = computed(() => {
  return {
    cellSize: 12,
    data: props.text,
    foreground: '#1C1C1C',
    background: '#fff',
    ...props?.optionsQr,
  }
})
</script>

<style scoped>
.qr-loader__path {
  fill: none;
  stroke-width: 5px;
  stroke: #fff;
  stroke-linecap: round;
  animation: animate-stroke 1s ease-in-out infinite;
}

@keyframes animate-stroke {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}
</style>
