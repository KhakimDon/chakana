<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t(steps[stepIndex].title)"
    body-class="w-full !max-w-[584px]"
    :has-back="stepIndex > 0"
    disable-outer-close
    @update:model-value="emit('update:modelValue', $event)"
    @back="stepIndex--"
  >
    <div class="space-y-4">
      <BaseStepper
        :steps
        :step
        class="!mb-5 w-full max-sm:overflow-x-auto"
        step-class="!w-9 !h-9"
        step-icon-class="!text-xl !leading-5"
        line-class="!w-full !min-w-4"
      />
      <component
        :is="steps[stepIndex].component"
        :form="steps[stepIndex].form"
        :is-auto="isAuto"
      />
      <BaseButton
        class="!py-3 w-full !mt-6"
        :loading
        :text="stepIndex === steps.length - 1 ? $t('save') : $t('next')"
        :disabled="disabledConfirm"
        size="md"
        @click="confirm"
      />
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

import {
  LazyOrderInfoFormAddress,
  LazyOrderInfoFormComment,
  LazyOrderInfoFormName,
  LazyOrderInfoFormPayment,
  LazyOrderInfoFormPickerComment,
  LazyOrderInfoFormPromocode,
  LazyOrderInfoFormTime,
  LazyOrderInfoFormUserInfo,
} from '#components'
import {
  orderFormAddress,
  orderFormComment,
  orderFormName,
  orderFormPayment,
  orderFormPickerComment,
  orderFormPromocode,
  orderFormTime,
  orderFormUserInfo,
} from '~/components/Order/Info/Form/index.js'
import { useCartOrderStore } from '~/store/cart_order.js'

interface Props {
  modelValue: boolean
  isAuto?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const router = useRouter()
const localePath = useLocalePath()

const loading = ref(false)

const disabledConfirm = computed(
  () =>
    steps.value[stepIndex.value].form.$v.value.$invalid ||
    (stepIndex.value === steps.value.length - 1 &&
      Object.values(steps.value[steps.value.length - 1].form.values).every(
        (e) => !e
      ))
)
let data = {}
function confirm() {
  data = {
    ...data,
    ...steps.value[stepIndex.value].form.values,
  }
  if (stepIndex.value === steps.value.length - 1) {
    useCartOrderStore().orderDetail = {
      ...data,
      isAuto: props.isAuto,
    }
    emit('update:modelValue', false)
    useCookie('order_data').value = useCartOrderStore().orderDetail
    router.push(localePath('/cart/payment'))
    return
  }
  stepIndex.value++
}

const orderSteps = [
  {
    id: 'address',
    icon: 'SvgoProfileTruck',
    title: 'address_delivery',
    component: LazyOrderInfoFormAddress,
    form: orderFormAddress,
  },
  {
    id: 'when_to_deliver',
    icon: 'SvgoProfileClockLocation',
    title: 'when_delivery',
    component: LazyOrderInfoFormTime,
    form: orderFormTime,
  },
  {
    id: 'user',
    icon: 'SvgoProfileUserCircle',
    title: 'recipient_details',
    component: LazyOrderInfoFormUserInfo,
    form: orderFormUserInfo,
  },
  {
    id: 'comment',
    icon: 'SvgoProfileMessage',
    title: 'courier_comment',
    component: LazyOrderInfoFormComment,
    form: orderFormComment,
  },
  {
    id: 'picker_comment',
    icon: 'SvgoProfileMessage',
    title: 'picker_comment',
    component: LazyOrderInfoFormPickerComment,
    form: orderFormPickerComment,
  },
  {
    id: 'promo',
    icon: 'SvgoProfileTicket',
    title: 'promo_code',
    component: LazyOrderInfoFormPromocode,
    form: orderFormPromocode,
  },
  {
    id: 'payment',
    icon: 'SvgoProfileMoney',
    title: 'payment_method',
    component: LazyOrderInfoFormPayment,
    form: orderFormPayment,
  },
]

const autoOrderNameStep = {
  id: 'name',
  icon: 'SvgoCommonEdit',
  title: 'auto_order_title',
  component: LazyOrderInfoFormName,
  form: orderFormName,
}

const steps = computed(() =>
  props.isAuto ? [autoOrderNameStep, ...orderSteps] : orderSteps
)
const stepIndex = ref(0)
const step = computed(() => steps.value[stepIndex.value].id)

const beforeRefresh = (event) => {
  event.preventDefault()

  return true
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      useEventListener(document, 'beforeunload', beforeRefresh)
    }
  }
)
</script>
