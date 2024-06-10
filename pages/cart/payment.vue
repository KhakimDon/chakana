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
              <PaymentCardInfo
                icon="SvgoProfileTruck"
                icon-class="text-orange !text-2xl"
                :title="$t('courier_address')"
                :subtitle="'123 Main Street'"
                @open-details="() => {}"
              />
              <PaymentSectionClockLocation
                :show-free-delivery="showFreeDelivery"
              />
              <PaymentSectionUserData />
              <PaymentSectionCommentForCurier />
            </section>
          </PaymentCardInfoHeader>
          <PaymentCardInfoHeader :title="$t('payment_method')">
            <section class="space-y-2">
              <PaymentCardInfo
                icon="SvgoProfileMoney"
                icon-class="text-green !text-2xl"
                :title="$t('cash')"
                @open-details="() => {}"
              />
            </section>
          </PaymentCardInfoHeader>
          <PaymentCardInfoHeader :title="$t('additional')">
            <section class="space-y-2">
              <PaymentCardInfo
                icon="SvgoProfileTicket"
                icon-class="text-orange !text-2xl"
                :no-clickable="hasPromoCode"
                :title="!hasPromoCode ? $t('promo_code') : null"
              >
                <div
                  v-if="hasPromoCode"
                  class="px-2 py-1 bg-orange flex-y-center gap-1 rounded-md text-white"
                >
                  <i18n-t
                    keypath="promo_badge"
                    tag="p"
                    scope="global"
                    class="text-white text-xs font-semibold leading-none"
                  >
                    <template #text>
                      <span
                        class="text-white text-xs font-extrabold leading-none"
                      >
                        (-{{ formatMoneyDecimal(limitPrice, 0) }} UZS)
                      </span>
                    </template>
                  </i18n-t>
                  <SvgoCommonClose
                    class="bg-white/20 cursor-pointer text-white rounded-full p-0.5 text-sm"
                    @click="removePromoCode"
                  />
                </div>
              </PaymentCardInfo>
            </section>
          </PaymentCardInfoHeader>
          <div
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
const hasPromoCode = ref(true)

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
  router.push(`/${locale.value}/cart/payment`)
}

// All prices
const totalCartProductsPrice = computed(() => {
  return (
    cartProducts.value.reduce((acc, product) => {
      return acc + product?.price * product?.cart_count
    }, 0) || 0
  )
})

const removePromoCode = () => {
  console.log('remove')
  hasPromoCode.value = false
}
</script>

<style scoped></style>
