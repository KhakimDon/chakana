<template>
  <div>
    <p class="text-sm leading-140 text-gray-100 mb-2">
      {{ $t('enter_confirmation_code_from_sms') || 'Введите код подтверждения из SMS.' }}
    </p>
    <p class="text-sm leading-140 text-gray-100 mb-4">
      {{ $t('confirmation_code_sent_to_number') || 'Код подтверждения отправлено на номер' }} {{ formattedPhone }}
    </p>
    
    <!-- 6 полей для OTP -->
    <div class="flex gap-2 justify-center my-5">
      <input
        v-for="(digit, index) in otpDigits"
        :key="index"
        :ref="el => { if (index === 0) firstOtpInputRef = el as HTMLInputElement }"
        v-model="otpDigits[index]"
        type="text"
        maxlength="1"
        class="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-orange focus:outline-none"
        @input="handleOtpInput(index, $event)"
        @keydown="handleOtpKeydown(index, $event)"
        @paste="handleOtpPaste($event)"
      />
    </div>

    <div class="flex items-center justify-center gap-2 mt-4">
      <button
        type="button"
        class="text-sm text-blue-100 hover:underline"
        :disabled="timerSeconds > 0"
        @click="$emit('resend')"
      >
        {{ $t('send_again') || 'Отправить повторно' }}
      </button>
      <span v-if="timerSeconds > 0" class="text-sm text-gray-100">
        {{ formatTimer(timerSeconds) }}
      </span>
    </div>

    <BaseButton
      class="mt-6 w-full h-11"
      v-bind="{ loading }"
      :text="$t('confirm') || 'Подтвердить'"
      :disabled="!isOtpComplete"
      @click="submit"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import type { TForm } from '~/composables/useForm'

interface Props {
  phone: string
  form: TForm<any>
  loading?: boolean
  error?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'submit', 'back', 'resend'])

const { form } = unref(props)

const otpDigits = ref(['', '', '', '', '', ''])
const timerSeconds = ref(120)
const firstOtpInputRef = ref<HTMLInputElement | null>(null)

const formattedPhone = computed(() => {
  if (!props.phone) return ''
  const digits = props.phone.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('998')) {
    const phone = digits.substring(3)
    return `+998 ${phone.substring(0, 2)} ${phone.substring(2, 5)} ${phone.substring(5, 7)} ${phone.substring(7)}`
  }
  return props.phone
})

const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '') && otpDigits.value.join('').length === 6
})

// Таймер обратного отсчета
let timerInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  startTimer()
  // Фокус на первый OTP инпут при монтировании
  nextTick(() => {
    firstOtpInputRef.value?.focus()
  })
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

function startTimer() {
  timerSeconds.value = 120
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  timerInterval = setInterval(() => {
    if (timerSeconds.value > 0) {
      timerSeconds.value--
    } else {
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
    }
  }, 1000)
}

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function handleOtpInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '')
  
  if (value) {
    otpDigits.value[index] = value[0]
    form.values.code = otpDigits.value.join('')
    
    // Переход к следующему полю
    if (index < 5) {
      const nextInput = target.parentElement?.children[index + 1] as HTMLInputElement
      nextInput?.focus()
    }
  } else {
    otpDigits.value[index] = ''
    form.values.code = otpDigits.value.join('')
  }
}

function handleOtpKeydown(index: number, event: KeyboardEvent) {
  const target = event.target as HTMLInputElement
  
  if (event.key === 'Backspace' && !target.value && index > 0) {
    // Переход к предыдущему полю при Backspace
    const prevInput = target.parentElement?.children[index - 1] as HTMLInputElement
    prevInput?.focus()
    prevInput?.select()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    const prevInput = target.parentElement?.children[index - 1] as HTMLInputElement
    prevInput?.focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    const nextInput = target.parentElement?.children[index + 1] as HTMLInputElement
    nextInput?.focus()
  }
}

function handleOtpPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '').substring(0, 6) || ''
  
  for (let i = 0; i < 6; i++) {
    otpDigits.value[i] = pastedData[i] || ''
  }
  
  form.values.code = otpDigits.value.join('')
  
  // Фокус на последнее заполненное поле или последнее поле
  const lastIndex = Math.min(pastedData.length - 1, 5)
  const lastInput = (event.target as HTMLElement).parentElement?.children[lastIndex] as HTMLInputElement
  lastInput?.focus()
}

watch(() => props.form.values.code, (newCode) => {
  if (newCode && newCode.length === 6) {
    const digits = newCode.split('')
    for (let i = 0; i < 6; i++) {
      otpDigits.value[i] = digits[i] || ''
    }
  }
})

function submit() {
  form.values.code = otpDigits.value.join('')
  form.$v.value.$touch()
  if (isOtpComplete.value && !form.$v.value.code.$error) {
    emit('submit')
  }
}

function back() {
  otpDigits.value = ['', '', '', '', '', '']
  form.values.code = ''
  form.$v.value.$reset()
  emit('back')
}

// Экспортируем ref для использования в родительском компоненте
defineExpose({
  firstOtpInputRef,
})
</script>
