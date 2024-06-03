<template>
  <BaseModal
    v-bind="{ show }"
    body-class="max-w-[424px]"
    :title="$t('authorization')"
    @close="$emit('close')"
  >
    <div>
      <LayoutAuthLogin
        v-if="step === 'login'"
        :form="loginForm"
        @submit="step = 'confirm'"
      />
      <LayoutAuthConfirm
        v-else-if="step === 'confirm'"
        :form="confirmForm"
        :phone="loginForm.values.phone"
        @back="step = 'login'"
      />
      <LayoutAuthRegister
        v-else-if="step === 'register'"
        :form="registerForm"
      />
      <LayoutAuthQr v-else />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'

import { isValidPhone } from '~/utils/functions/common'

interface Props {
  show: boolean
}

defineProps<Props>()
defineEmits(['close'])

const step = ref('qr')

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
</script>
