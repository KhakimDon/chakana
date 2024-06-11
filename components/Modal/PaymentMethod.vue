<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('payment_method')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div>
      <div
        class="flex-y-center gap-1 select-none cursor-pointer"
        @click="courierCard = !courierCard"
      >
        <SvgoProfileUser class="text-orange text-2xl" />
        <div
          class="flex-y-center gap-1 border-b border-white-100 py-4 justify-between w-full"
        >
          <p class="text-sm font-semibold leading-tight text-dark">
            {{ $t('courier_card') }}
          </p>
          <FormRadio v-if="!courierCard" v-model="courierCard" class="!p-0" />
          <FormRadio v-else class="!p-0" />
        </div>
      </div>
      <div
        class="flex-y-center gap-1 select-none cursor-pointer"
        @click="cash = !cash"
      >
        <SvgoProfileMoney class="text-green text-2xl" />
        <div
          class="flex-y-center gap-1 border-b border-white-100 py-4 justify-between w-full"
        >
          <p class="text-sm font-semibold leading-tight text-dark">
            {{ $t('cash') }}
          </p>
          <FormRadio v-if="!cash" v-model="cash" class="!p-0" />
          <FormRadio v-else class="!p-0" />
        </div>
      </div>
      <PaymentCardInfo
        v-if="false"
        icon="SvgoProfileCard"
        icon-class="!text-blue-100 !text-2xl"
        :title="$t('payment_via_card')"
        @open-details="() => {}"
      />
      <div class="flex-y-center gap-1 my-4">
        <SvgoProfileCoins class="text-orange text-2xl" />
        <p class="text-sm font-semibold leading-tight text-dark">
          {{ $t('payment_system') }}
        </p>
      </div>
      <CommonPaymentTypes v-model="paymentType" :providers="paymentProviders" />
      <BaseButton
        class="!py-3 w-full !mt-6"
        :loading
        :text="$t('save')"
        size="md"
        @click="add"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { usePaymentStore } from '~/store/payment.js'

interface Props {
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const loading = ref(false)
const courierCard = ref(false)
const cash = ref(false)
const paymentType = ref(0)

watch(
  () => cash.value,
  (val) => {
    if (val) {
      courierCard.value = false
      paymentType.value = 0
    }
  }
)

watch(
  () => courierCard.value,
  (val) => {
    if (val) {
      cash.value = false
      paymentType.value = 0
    }
  }
)

watch(
  () => paymentType.value,
  (val) => {
    if (val) {
      cash.value = false
      courierCard.value = false
    }
  }
)

const orderCartStore = useCartOrderStore()
function add() {
  orderCartStore.orderDetail.payment_method.provider_id = paymentType.value
  orderCartStore.orderDetail.payment_method.cash = cash.value
  orderCartStore.orderDetail.payment_method.card_to_the_courier =
    courierCard.value
  orderCartStore.orderDetail.payment_method.card_id = 0

  emit('update:modelValue', false)
}

const paymentStore = usePaymentStore()

onMounted(() => {
  paymentStore.getPaymentProviderList()
})

const paymentProviders = computed(() => paymentStore.paymentProviders.list)
</script>
