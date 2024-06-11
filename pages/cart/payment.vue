<template>
  <LayoutWrapper>
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
            <div
              class="flex-y-center group justify-between py-2 w-full h-[52px]"
            >
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
    <template #right>
      <section class="space-y-5">
        <CartCardFreeDelivery :cart-total-price="totalCartProductsPrice" />
        <CartCardPriceInfo />
        <BaseButton
          class="w-full !rounded-10"
          :text="$t('payment')"
          variant="green"
          :loading="loading"
          @click="goToPayment"
        />
      </section>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useCustomToast } from '~/composables/useCustomToast.js'
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const { t, locale } = useI18n()
const router = useRouter()
const cartStore = useCartStore()

const limitPrice = computed(
  () => orderCartStore?.cart?.detail?.free_delivery_price ?? 0
)
const useBalance = ref(false)

const toggleUseBalance = () => {
  useBalance.value = !useBalance.value
  orderCartStore.orderDetail.use_from_balance = useBalance.value
}

const showFreeDelivery = computed(() => {
  return totalCartProductsPrice.value > limitPrice.value
})

const balancePrice = computed(() => orderCartStore.cart?.detail?.balance ?? 0)

const goBack = () => {
  router.back()
}

const orderCartStore = useCartOrderStore()

const orderDetail = computed(() => orderCartStore.orderDetail)
const loading = computed(() => orderCartStore.orderCreating)

const { showToast } = useCustomToast()

const goToPayment = () => {
  orderCartStore
    .createOrder({
      ...orderDetail.value,
      when_to_deliver: orderDetail.value.when_to_deliver
        ?.toISOString()
        ?.split('.')[0],
    })
    .then(() => {
      showToast(t('order_created'), 'success')
      cartStore.getCartProducts()
      router.push(`/${locale.value}/profile/orders`)
    })
    .catch(() => {
      showToast(t('order_not_created'), 'error')
    })
}

// All prices
const totalCartProductsPrice = computed(
  () => orderCartStore.cart?.detail?.product_price
)

watch(
  () => orderCartStore.orderDetail,
  (val) => {
    if (
      val?.promo_code_id ||
      val?.address?.id ||
      val?.use_from_balance ||
      !val.use_from_balance
    ) {
      orderCartStore.getCartDetailConfirm({
        promo_code_id: val.promo_code_id,
        address_id: val.address?.id,
        is_use_balance: val?.use_from_balance,
      })
    }
  },
  { immediate: true, deep: true }
)

const cartProducts = computed(() => cartStore?.products)

onMounted(() => {
  if (cartProducts.value?.length === 0) {
    router.push(`/${locale.value}/cart`)
  }
})
</script>

<style scoped></style>
