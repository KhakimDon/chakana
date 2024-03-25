<template>
  <div
    id="countdown"
    class="absolute h-7 w-7 right-3 text-center bg-transparent rounded-full flex items-center justify-center"
  >
    <IconClose class="text-lg translate-y-px text-gray" />
    <svg class="svg-circle">
      <circle r="18" cx="20" cy="20" />
    </svg>
  </div>
</template>
<script setup lang="ts">
import IconClose from '~/assets/icons/Common/close.svg'

interface Props {
  isCancelled?: boolean
}

const props = defineProps<Props>()
interface Emits {
  (e: 'finished'): void
}

const timer = ref()

const number = ref(5)

const emit = defineEmits<Emits>()
setInterval(() => {
  if (number.value > 0) {
    number.value--
  }
}, 1000)

onMounted(() => {
  timer.value = setTimeout(() => {
    emit('finished')
  }, 5000)
})

watch(
  () => props.isCancelled,
  () => {
    clearTimeout(timer.value)
  }
)
</script>

<style scoped>
.svg-circle {
  position: absolute;
  top: -9px;
  right: -7px;
  width: 44px;
  height: 44px;
  transform: rotateY(-180deg) rotateZ(-90deg) scale(0.6);
}

.svg-circle circle {
  stroke-dasharray: 113px;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  stroke-width: 3px;
  stroke: #eaeaea;
  fill: none;
  animation: countdown 5s linear forwards;
}

@keyframes countdown {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 113px;
  }
}
</style>
