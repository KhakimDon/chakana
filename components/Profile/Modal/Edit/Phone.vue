<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('change_phone_number')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-if="step === 0">
      <FormGroup :label="$t('phone_number')">
        <FormInput
          v-model="phoneForm.values.phone"
          v-maska="'## ###-##-##'"
          placeholder="00 000-00-00"
          input-class="!pl-1"
          type="number"
          :error="phoneForm.$v.value.phone.$error"
          @keydown.enter="submit"
        >
          <template #prefix>
            <div class="flex-center h-11">
              <p class="text-base sm:text-sm text-dark pl-3 py-3 font-medium">
                +998
              </p>
            </div>
          </template>
        </FormInput>
      </FormGroup>
      <BaseButton
        :disabled="phoneForm.$v.value.$invalid"
        :text="$t('confirm')"
        class="mt-7 w-full"
        :loading="loading"
        @click="submit"
      />
    </template>
    <LayoutAuthConfirm
      v-else
      :error="wrongCode"
      :phone="'+998 ' + phoneForm.values.phone"
      :form="confirmForm"
      :loading="loading"
      @submit="submitOtp"
      @resend="submit"
    />
    <ProfileModalEditTooManyTries v-model="tooManyTries" />
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'

import { useAuthStore } from '~/store/auth.js'
import { isValidPhone } from '~/utils/functions/common.js'

interface Props {
  modelValue: boolean
}
defineProps<Props>()

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const emit = defineEmits<Emits>()

const authStore = useAuthStore()

const { handleError } = useErrorHandling()
const { showToast } = useCustomToast()

const step = ref(0)
const tooManyTries = ref(false)
const loading = ref(false)

const phoneForm = useForm(
  {
    phone: null,
  },
  {
    phone: { required, isValidPhone },
  },
  { $stopPropagation: true }
)

const session = ref('')
function submit() {
  phoneForm.$v.value.$touch()
  if (!phoneForm.$v.value.$invalid) {
    loading.value = true
    const phone = '+998' + phoneForm.values.phone.replace(/\D/g, '')
    authStore
      .sendSms(phone, 'update_phone_verification')
      .then((res) => {
        session.value = res.session
        step.value++
      })
      .catch((err) => {
        if (err._data.detail.code === 'sms_already_sent') {
          step.value++
        } else {
          handleError(err)
        }
      })
      .finally(() => (loading.value = false))
  }
}

const confirmForm = useForm(
  {
    code: '',
  },
  {
    code: { required, minLength: minLength(6) },
  },
  { $stopPropagation: true }
)

const wrongCode = ref(false)

function submitOtp() {
  loading.value = true
  useApi()
    .$put('/update/phone', {
      body: {
        phone_number: '+998' + phoneForm.values.phone.replace(/\D/g, ''),
        otp_code: confirmForm.values.code,
        session: session.value,
      },
    })
    .then(() => {
      emit('update:modelValue', false)
      showToast('phone_updated_successfully', 'success')
    })
    .catch((err) => {
      wrongCode.value = err._data.detail.code === 'wrong_code'
      handleError(err)
    })
    .finally(() => (loading.value = false))
}
</script>
