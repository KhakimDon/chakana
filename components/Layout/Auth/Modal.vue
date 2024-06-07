<template>
  <BaseModal
    v-bind="{ show }"
    body-class="max-w-[424px]"
    :title="$t('authorization')"
    :has-back="step === 'qr'"
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
        />
        <LayoutAuthQr v-else />
      </div>
    </Transition>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'
import { watch } from 'vue'

import { isValidPhone } from '~/utils/functions/common'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
defineEmits(['close'])

const step = ref('login')
const buttonLoading = ref(false)
const params = ref({
  phone: '',
  session: '',
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
  useApi()
    .$post('/send-sms', {
      body: {
        phone_number: params.value.phone,
        type_: 'login_sms_verification',
      },
    })
    .then((res: any) => {
      if (!res?.register) {
        step.value = 'confirm'
      }
    })
    .catch((err) => {
      console.log(err)
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
    .then((res: any) => {
      console.log('res, ', res)
      params.value.session = res.session
      step.value = 'register'
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => (buttonLoading.value = false))
}

watch(
  () => props.show,
  () => {
    step.value = 'login'
  }
)
</script>
