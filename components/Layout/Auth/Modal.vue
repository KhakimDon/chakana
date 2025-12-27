<template>
  <BaseModal
    body-class="max-w-[424px]"
    :title="$t('authorization')"
    :has-back="step === 'confirm'"
    disable-outer-close
    @close="$emit('close')"
    @back="step = 'login'"
  >
    <!-- Переключатель режимов Вход/Регистрация -->
    <div v-if="step === 'login'" class="flex gap-2 mb-6">
      <button
        :class="[
          'flex-1 py-2 px-4 rounded-lg font-medium transition-colors',
          currentMode === 'login'
            ? 'bg-blue-100 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
        @click="currentMode = 'login'"
      >
        {{ $t('login') }}
      </button>
      <button
        :class="[
          'flex-1 py-2 px-4 rounded-lg font-medium transition-colors',
          currentMode === 'register'
            ? 'bg-blue-100 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
        @click="currentMode = 'register'"
      >
        {{ $t('register') }}
      </button>
    </div>

    <Transition name="fade" mode="out-in">
      <div :key="step">
        <LayoutAuthLogin
          v-if="step === 'login'"
          :form="loginForm"
          :loading="buttonLoading"
          @submit="startRegistration"
        />
        <LayoutAuthConfirm
          v-else-if="step === 'confirm'"
          :form="confirmForm"
          :phone="params.phone"
          :loading="buttonLoading"
          @submit="confirmCode"
          @back="step = 'login'"
          @resend="startRegistration"
        />
      </div>
    </Transition>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '~/store/auth.js'
import {
  isValidPhone,
  isValidPassword,
} from '../../../utils/functions/common.js'
import { useForm } from '../../../composables/useForm.js'
import { useErrorHandling } from '../../../composables/useErrorHandling.js'
import { useCustomToast } from '../../../composables/useCustomToast.js'
import { useIdentityApi } from '../../../composables/useIdentityApi.js'

const { locale } = useI18n()

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const { show } = unref(props)
defineEmits(['close'])
const { handleError } = useErrorHandling()
const { showToast } = useCustomToast()
const { t } = useI18n()

const authStore = useAuthStore()
const step = ref<'login' | 'confirm'>('login')
const buttonLoading = ref(false)
const params = ref({
  phone: '',
  password: '',
})
const isExistingUser = ref(false)
const currentMode = ref<'login' | 'register'>('login')

const loginForm = useForm(
  {
    phone: '',
    password: '',
  },
  {
    phone: { required, isValidPhone },
    password: {
      required,
      // Валидация сложности пароля будет проверяться при submit, а не при вводе
      // Это позволяет активировать кнопку когда поля заполнены
    },
  }
)

const confirmForm = useForm(
  {
    code: '',
  },
  {
    code: { required, minLength: minLength(6) },
  }
)

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  // маска "## ###-##-##" -> 9 цифр без кода страны
  if (digits.length === 9) {
    return `998${digits}`
  }
  return digits
}

async function startRegistration() {
  loginForm.$v.value.$touch()
  if (loginForm.$v.value.$invalid) return

  buttonLoading.value = true
  const identityApi = useIdentityApi()

  try {
    const userName = normalizePhone(loginForm.values.phone)
    params.value.phone = userName
    params.value.password = loginForm.values.password

    if (currentMode.value === 'register') {
      // Режим регистрации - проверяем валидность пароля
      if (!isValidPassword(loginForm.values.password)) {
        showToast(
          t('password_requirements') ||
            'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну прописную букву, одну цифру и один спецсимвол',
          'error'
        )
        buttonLoading.value = false
        return
      }

      // Проверяем существование пользователя перед регистрацией
      const userExists = await identityApi.checkUserExists(userName)
      
      if (userExists) {
        // Пользователь уже существует
        showToast(t('user_already_exists') || 'Пользователь с таким номером уже зарегистрирован', 'error')
        buttonLoading.value = false
        return
      }

      // Регистрируем нового пользователя
      isExistingUser.value = false
      const languageId = (locale.value as 'ru' | 'uz' | 'en') || 'ru'
      await identityApi.register(userName, params.value.password, languageId)
      await identityApi.getOtp(userName)
    } else {
      // Режим входа - проверяем существование пользователя
      const userExists = await identityApi.checkUserExists(userName)
      
      if (!userExists) {
        // Пользователь не существует
        showToast(t('user_not_found') || 'Пользователь с таким номером не найден', 'error')
        buttonLoading.value = false
        return
      }

      // Пользователь существует, получаем OTP для входа
      isExistingUser.value = true
      await identityApi.getOtp(userName)
    }

    step.value = 'confirm'
  } catch (err) {
    handleError(err as any)
  } finally {
    buttonLoading.value = false
  }
}

async function confirmCode() {
  confirmForm.$v.value.$touch()
  if (confirmForm.$v.value.$invalid) return

  buttonLoading.value = true
  const identityApi = useIdentityApi()

  try {
    const response = await identityApi.verifyOtp(
      params.value.phone,
      params.value.password,
      confirmForm.values.code
    )

    // Токен может прийти как строка или как объект с полем authToken
    let token: string
    if (typeof response === 'string') {
      token = response
    } else if (response && typeof response === 'object' && 'authToken' in response) {
      token = (response as any).authToken
    } else {
      throw new Error('Invalid token response format')
    }

    authStore.setTokens({
      access_token: token,
    })

    await authStore.fetchUser().catch(() => {})
    showToast(t('login_success'), 'success')
    authStore.showAuth = false
  } catch (err) {
    handleError(err as any)
  } finally {
    buttonLoading.value = false
  }
}

watch(
  () => authStore.showAuth,
  () => {
    step.value = 'login'
    currentMode.value = 'login'
    loginForm.values.phone = ''
    loginForm.values.password = ''
    confirmForm.values.code = ''
    isExistingUser.value = false
    loginForm.$v.value.$reset()
    confirmForm.$v.value.$reset()
  }
)

watch(currentMode, () => {
  // Сбрасываем форму при смене режима
  loginForm.values.phone = ''
  loginForm.values.password = ''
  loginForm.$v.value.$reset()
})
</script>
