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
          @submit="step = 'confirm'"
          @to-qr="step = 'qr'"
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

watch(
  () => props.show,
  () => {
    step.value = 'login'
  }
)
</script>
