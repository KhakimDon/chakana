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
          <PaymentSectionPromoCode v-if="false" />
          <div
            v-if="false"
            class="flex-y-center gap-3 select-none cursor-pointer"
            @click="toggleUseBalance"
          >
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
                      price: formatMoneyDecimal(limitPrice, 0),
                    })
                  }}
                </p>
              </div>
              <FormToggle v-model="useBalance" class="text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <template #right>
      <section class="space-y-5">
        <CartCardFreeDelivery
          :free-delivery-price="limitPrice"
          :cart-total-price="totalCartProductsPrice"
        />
        <CartCardPriceInfo />
        <BaseButton
          class="w-full !rounded-10"
          :text="$t('payment')"
          variant="green"
          @click="goToPayment"
        />
      </section>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const { t, locale } = useI18n()
const router = useRouter()
const cartStore = useCartStore()

const limitPrice = ref(90000)
const useBalance = ref(false)

const toggleUseBalance = () => {
  useBalance.value = !useBalance.value
}

const showFreeDelivery = computed(() => {
  return totalCartProductsPrice.value > limitPrice.value
})

const cartProducts = computed(() => cartStore.products)

const goBack = () => {
  router.back()
}
const goToPayment = () => {
  // router.push(`/${local  e.value}/cart/payment`)
}

// All prices
const totalCartProductsPrice = computed(() => {
  return (
    cartProducts.value.reduce((acc, product) => {
      return acc + product?.price * product?.cart_count
    }, 0) || 0
  )
})
</script>

<style scoped></style>
