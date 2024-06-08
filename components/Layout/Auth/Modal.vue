<template>
  <BaseModal
    body-class="max-w-[424px]"
    :title="$t('authorization')"
    :has-back="step === 'qr'"
    disable-outer-close
    @close="$emit('close')"
    @back="step = 'login'"
  >
    <Transition name="fade" mode="out-in">
      <div :key="step">
        <LayoutAuthLogin
          v-if="step === 'login'"
          :form="loginForm"
          :loading="buttonLoading"
          @submit="sendSms"
          @to-qr="step = 'qr'"
        />
        <LayoutAuthConfirm
          v-else-if="step === 'confirm'"
          :form="confirmForm"
          :phone="params.phone"
          :loading="buttonLoading"
          @submit="confirmCode"
          @back="step = 'login'"
        />
        <LayoutAuthRegister
          v-else-if="step === 'register'"
          :form="registerForm"
          :loading="buttonLoading"
          @submit="register"
        />
        <LayoutAuthQr v-else />
      </div>
    </Transition>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'
import { watch } from 'vue'

import { useAuthStore } from '~/store/auth.js'
import { isValidPhone } from '~/utils/functions/common'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const { show } = unref(props)
defineEmits(['close'])
const { handleError } = useErrorHandling()

const authStore = useAuthStore()
const step = ref('login')
const buttonLoading = ref(false)
const params = ref({
  phone: '',
  session: '',
  isRegister: false,
})

const loginForm = useForm(
  {
    phone: '',
  },
  {
    phone: { required, isValidPhone },
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

const registerForm = useForm(
  {
    name: '',
    avatar: '',
    instagram: '',
    telegram: '',
  },
  {
    name: { required },
  }
)

function sendSms() {
  buttonLoading.value = true
  params.value.phone = '+998' + loginForm.values.phone?.replace(/\D/g, '')
  useAuthStore()
    .sendSms(params.value.phone)
    .then((res: any) => {
      params.value.isRegister = res.register
      step.value = 'confirm'
      params.value.session = res.session
    })
    .catch((err) => {
      handleError(err)
    })
    .finally(() => (buttonLoading.value = false))
}

function confirmCode() {
  buttonLoading.value = true
  useApi()
    .$post('/verify', {
      body: {
        phone_number: params.value.phone,
        session: params.value.session,
        otp_code: confirmForm.values.code,
      },
    })
    .then(() => {
      if (params.value.isRegister) {
        step.value = 'register'
      } else {
        register()
      }
    })
    .catch((err) => {
      handleError(err)
    })
    .finally(() => (buttonLoading.value = false))
}

function register() {
  buttonLoading.value = true
  useApi()
    .$post('/login', {
      body: {
        name: registerForm.values.name || undefined,
        instagram: registerForm.values.instagram || undefined,
        telegram: registerForm.values.telegram || undefined,
        session: params.value.session,
        phone_number: params.value.phone,
        otp_code: confirmForm.values.code,
      },
    })
    .then((res: any) => {
      authStore.setTokens(res)
      setTimeout(() => {
        if (registerForm.values.avatar) {
          const formData = new FormData()
          formData.append('image', registerForm.values.avatar)
          useApi()
            .$post('upload/avatar', { body: formData })
            .then(() => {
              authStore.fetchUser().finally(() => {
                buttonLoading.value = false
              })
            })
            .catch((err) => {
              buttonLoading.value = false
              handleError(err)
            })
        } else {
          authStore.fetchUser().finally(() => {
            buttonLoading.value = false
          })
        }
        authStore.showAuth = false
      }, 300)
    })
    .catch((err) => {
      buttonLoading.value = false
      handleError(err)
    })
}

watch(
  () => authStore.showAuth,
  () => {
    step.value = 'login'
    loginForm.values.phone = ''
    confirmForm.values.code = ''
    registerForm.values.name = ''
    registerForm.values.instagram = ''
    registerForm.values.telegram = ''
    loginForm.$v.value.$reset()
    confirmForm.$v.value.$reset()
    registerForm.$v.value.$reset()
  }
)
</script>
