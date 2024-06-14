<template>
  <Transition name="fade" mode="out-in">
    <div :key="$route.name">
      <div class="flex-y-center gap-1 cursor-pointer" @click="goBack">
        <SvgoCommonChevron class="text-base text-gray-100" />
        <p class="text-sm font-semibold text-gray-100">
          {{ $t('go_back') }}
        </p>
      </div>
      <div class="flex-y-center justify-between mt-3">
        <p class="text-[22px] font-extrabold leading-7">
          {{ $t('placing_order') }}
        </p>
      </div>
      <div class="w-full my-6 space-y-6">
        <PaymentCardInfoHeader :title="$t('delivery_details')">
          <section class="space-y-2">
            <PaymentSectionAddress />
            <PaymentSectionClockLocation
              :show-free-delivery="showFreeDelivery"
            />
            <PaymentSectionUserData />
            <PaymentSectionCommentForCurier />
          </section>
        </PaymentCardInfoHeader>
        <PaymentSectionPaymentMethod />
        <PaymentSectionPromoCode />
        <div class="flex-y-center gap-3 select-none cursor-pointer relative">
          <div class="shrink-0 flex-center">
            <SvgoProfileWallet class="text-2xl text-green-600" />
          </div>
          <div class="flex-y-center group justify-between py-2 w-full h-[52px]">
            <div class="space-y-1">
              <p class="text-sm font-semibold leading-tight text-dark">
                {{ $t('use_balance') }}
              </p>
              <p class="text-xs font-normal leading-none text-gray-100">
                {{
                  t('card_price', {
                    price: formatMoneyDecimal(balancePrice, 0),
                  })
                }}
              </p>
            </div>
            <FormToggle
              v-model="useBalance"
              class="text-2xl"
              @change="toggleUseBalance"
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const { t } = useI18n()
const router = useRouter()

const orderCartStore = useCartOrderStore()

const limitPrice = computed(
  () => orderCartStore?.cart?.detail?.free_delivery_price ?? 0
)

const useBalance = ref(false)

const toggleUseBalance = () => {
  useBalance.value = !useBalance.value
  orderCartStore.orderDetail.use_from_balance = useBalance.value
}

const totalCartProductsPrice = computed(
  () => orderCartStore.cart?.detail?.product_price
)

const showFreeDelivery = computed(() => {
  return totalCartProductsPrice.value > limitPrice.value
})

const balancePrice = computed(() => orderCartStore.cart?.detail?.balance ?? 0)

const goBack = () => {
  router.back()
}
</script>

<style scoped></style>
