<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('add_card')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-if="step === 1">
      <FormGroup :label="$t('card_number')">
        <FormInput
          v-model="form.values.card_number"
          v-maska="'#### #### #### ####'"
          placeholder="0000 0000 0000 0000"
          :error="form.$v.value.card_number.$error"
          class="px-3"
          input-class="!pl-2"
        >
          <template #prefix>
            <BasePaymentLogo :number="form.values.card_number" />
          </template>
        </FormInput>
      </FormGroup>
      <FormGroup class="mt-4 mb-16 max-w-[163px]" :label="$t('expire_date')">
        <FormInput
          v-model="form.values.expiry_date"
          v-maska="'##/##'"
          placeholder="__/__"
          :error="form.$v.value.expiry_date.$error"
        >
        </FormInput>
      </FormGroup>
    </template>
    <template v-else>
      <p
        class="text-sm font-normal leading-140 text-gray-100 whitespace-pre-line mb-3"
      >
        {{ $t('enter_code_from_sms_code_sent_for_number') }}
      </p>
      <span
        class="py-1 px-2 rounded-lg border border-white-100 bg-gray-300 text-sm font-semibold leading-130 text-dark"
      >
        {{ otpSentPhone }}
      </span>
      <FormOTP v-model="form.values.otp_code" class="my-5" />
      <CommonTimer class="mb-10" :seconds-val="120" @resend="createCard" />
    </template>
    <BaseButton
      class="!py-3 w-full"
      :loading
      :text="step === 1 ? $t('add') : $t('confirm')"
      size="md"
      @click="add"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import { requiredIf } from '@vuelidate/validators'

import { checkExpireDate } from '~/utils/functions/common.js'

interface Props {
  modelValue: boolean
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { showToast } = useCustomToast()

const { t } = useI18n()

const step = ref(1)
const loading = ref(false)

const form = useForm(
  {
    card_number: '',
    expiry_date: '',
    otp_code: '',
  },
  {
    card_number: { requiredIf: requiredIf(() => step.value === 1) },
    expiry_date: {
      requiredIf: requiredIf(() => step.value === 1),
      checkExpireDate,
    },
    otp_code: { requiredIf: requiredIf(() => step.value === 2) },
  }
)

const cid = ref('')
const otpSentPhone = ref('')

function createCard() {
  useApi()
    .$post('/card/create', {
      body: {
        card_number: form.values.card_number.replaceAll(/\s/g, ''),
        expiry_date: form.values.expiry_date.split('/').reverse().join(''),
      },
    })
    .then((res: { cid: string; otpSentPhone: string }) => {
      cid.value = res.cid
      otpSentPhone.value = res.otpSentPhone
      step.value = 2
    })
    .catch((err: Error) => {
      const { handleError } = useErrorHandling()
      handleError(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function confirmCard() {
  useApi()
    .$post('/card/confirm', {
      body: {
        card_cid: cid.value,
        otp_code: form.values.otp_code,
      },
    })
    .then(() => {
      showToast('success', t('card_added_successfully'))
      emit('update:modelValue', false)
    })
    .catch((err: Error) => {
      const { handleError } = useErrorHandling()
      handleError(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function add() {
  form.$v.value.$touch()
  if (!form.$v.value.$invalid) {
    loading.value = true
    if (step.value === 1) {
      createCard()
    } else {
      confirmCard()
    }
  }
}
</script>
