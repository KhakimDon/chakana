<template>
  <BaseModal
    :model-value="modelValue"
    :has-back="isCartRoute"
    :title="$t('recipient_details')"
    @update:model-value="$emit('update:modelValue', $event)"
    @back="bacToClock"
  >
    <BaseStepper
      v-if="isCartRoute"
      :steps="$route?.query?.order === 'auto' ? autoOrderSteps : orderSteps"
      :step
      step-class="!w-full"
      class="!mb-5"
    />
    <div class="space-y-4">
      <FormGroup :label="$t('full_name')">
        <FormInput
          v-model="form.values.name"
          :error="form.$v.value.name.$error"
          :placeholder="$t('enter_full_name')"
        />
      </FormGroup>
      <FormGroup :label="$t('phone_number')">
        <FormInput
          v-model="form.values.phone"
          v-maska="'## ###-##-##'"
          placeholder="00 000-00-00"
          input-class="!pl-1"
          type="number"
          :error="form.$v.value.phone.$error"
        >
          <template #prefix>
            <div class="flex-center h-11">
              <p
                class="text-base sm:text-sm leading-5 text-dark pl-3 font-medium max-sm:-mb-0.5"
              >
                +998
              </p>
            </div>
          </template>
        </FormInput>
      </FormGroup>
      <BaseButton
        class="!py-3 w-full !mt-6"
        :loading
        :text="$t('save')"
        size="md"
        :disabled="form.$v.value.$invalid"
        @click="add"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'

import { autoOrderSteps, orderSteps } from '~/data/stepper.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'
import { isValidPhone } from '~/utils/functions/common.js'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const modalStore = useModalStore()

const route = useRoute()
const { locale } = useI18n()

const isCartRoute = computed(() => {
  return (
    route.path === `/${locale.value}/cart` ||
    route.path === `/${locale.value}/cart/`
  )
})

const loading = ref(false)

const form = useForm(
  {
    name: '',
    phone: '',
  },
  {
    name: { required, minLength: minLength(3) },
    phone: { required, isValidPhone },
  }
)

function bacToClock() {
  modalStore.userModel = false
  if (route.query?.order === 'auto') {
    modalStore.autoOrderModel.whenToDelivery = true
  } else {
    modalStore.clockModel = true
  }
}

const orderCartStore = useCartOrderStore()

function add() {
  form.$v.value.$touch()
  if (!form.$v.value.$invalid) {
    loading.value = true
    orderCartStore.orderDetail.recipient.full_name = form.values.name
    orderCartStore.orderDetail.recipient.phone = form.values.phone
    loading.value = false
    if (isCartRoute.value) {
      modalStore.commentModel = true
    }
    emit('update:modelValue', false)
  }
}

watch(
  () => props.modelValue,
  () => {
    form.$v.value.$reset()
  }
)

const step = ref('user')
</script>
