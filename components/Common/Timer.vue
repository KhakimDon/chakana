<template>
  <div>
    <div v-if="timer" class="flex items-center space-x-2">
      <p class="font-semibold text-dark text-base leading-130">
        {{ $t('send_again') }}
      </p>
      <p class="text-base leading-130 text-gray-100 font-semibold">
        {{ time }}
      </p>
    </div>
    <div v-else class="flex items-center gap-2 cursor-pointer" @click="resend">
      <p class="font-semibold text-dark text-base leading-130">
        {{ $t('send_again') }}
      </p>
      <IconRefresh />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconRefresh from '~/assets/icons/Common/refresh.svg'

interface Props {
  secondsVal: number
}
const props = defineProps<Props>()

interface Emits {
  (e: 'timeout'): void
  (e: 'resend'): void
}
const $emit = defineEmits<Emits>()

const seconds = ref(0)
const timer = ref(true)

const time = ref('')

const countDown = () => {
  seconds.value--

  const mm = Math.floor(seconds.value / 60)
  const ss = Math.floor(seconds.value % 60)

  time.value = `${mm > 9 ? mm : '0' + mm}:${ss > 9 ? ss : '0' + ss}`
}

function resend() {
  $emit('resend')
  timer.value = true
  seconds.value = props.secondsVal + 1
  const interval = setInterval(function () {
    countDown()

    if (seconds.value < 0) {
      clearInterval(interval)
      timer.value = false
      time.value = '00:00'
      $emit('timeout')
    }
  }, 1000)
}

watch(
  () => props.secondsVal,
  () => {
    seconds.value = props.secondsVal
    countDown()
  },
  { immediate: true }
)

const interval = setInterval(function () {
  countDown()

  if (seconds.value < 0) {
    clearInterval(interval)
    timer.value = false
    time.value = '00:00'
    $emit('timeout')
  }
}, 1000)
</script>
