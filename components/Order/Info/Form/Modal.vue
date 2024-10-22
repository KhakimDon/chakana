<template>
  <BaseModal
    :has-back="stepIndex > 0"
    :model-value="modelValue"
    :title="$t(steps[stepIndex].title)"
    body-class="w-full !max-w-[584px]"
    disable-outer-close
    @back="stepIndex--"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <BaseStepper
        :step
        :steps
        class="!mb-5 w-full max-sm:overflow-x-auto"
        line-class="!w-full !min-w-4"
        step-class="!w-9 !h-9"
        step-icon-class="!text-xl !leading-5"
      />
      <div class="overflow-y-auto sm:max-h-96 max-h-[50vh] overflow-x-hidden">
        <component
          :is="steps[stepIndex].component"
          :form="steps[stepIndex].form"
          :is-auto="isAuto"
        />
      </div>
      <BaseButton
        :disabled="disabledConfirm"
        :loading
        :text="stepIndex === steps.length - 1 ? $t('save') : $t('next')"
        class="!py-3 w-full !mt-6"
        size="md"
        @click="confirm"
      />
    </div>
  </BaseModal>
</template>
<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'

import {
  OrderInfoFormAddress,
  OrderInfoFormComment,
  OrderInfoFormName,
  OrderInfoFormPayment,
  OrderInfoFormPickerComment,
  OrderInfoFormPromocode,
  OrderInfoFormTime,
  OrderInfoFormUserInfo,
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
    component: OrderInfoFormAddress,
    form: orderFormAddress,
  },
  {
    id: 'when_to_deliver',
    icon: 'SvgoProfileClockLocation',
    title: 'when_delivery',
    component: OrderInfoFormTime,
    form: orderFormTime(props.isAuto),
  },
  {
    id: 'user',
    icon: 'SvgoProfileUserCircle',
    title: 'recipient_details',
    component: OrderInfoFormUserInfo,
    form: orderFormUserInfo,
  },
  {
    id: 'comment',
    icon: 'SvgoProfileMessage',
    title: 'courier_comment',
    component: OrderInfoFormComment,
    form: orderFormComment,
  },
  {
    id: 'picker_comment',
    icon: 'SvgoProfileMessage',
    title: 'picker_comment',
    component: OrderInfoFormPickerComment,
    form: orderFormPickerComment,
  },
  {
    id: 'promo',
    icon: 'SvgoProfileTicket',
    title: 'promo_code',
    component: OrderInfoFormPromocode,
    form: orderFormPromocode,
  },
  {
    id: 'payment',
    icon: 'SvgoProfileMoney',
    title: 'payment_method',
    component: OrderInfoFormPayment,
    form: orderFormPayment,
  },
]

const autoOrderNameStep = {
  id: 'name',
  icon: 'SvgoCommonEdit',
  title: 'auto_order_title',
  component: OrderInfoFormName,
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

watch(
  orderFormAddress.values,
  () => {
    orderFormComment.values.location_details = {
      entrance: orderFormAddress.values?.address_info?.entrance ?? '',
      floor: orderFormAddress.values?.address_info?.floor ?? '',
      home_number: orderFormAddress.values?.address_info?.home_number ?? '',
      entrance_code: orderFormAddress.values?.address_info?.entrance_code ?? '',
    }
  },
  { deep: true }
)
</script>
