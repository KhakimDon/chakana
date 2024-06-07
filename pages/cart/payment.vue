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
              <PaymentCardInfo
                icon="SvgoProfileClockLocation"
                icon-class="text-purple-500 !text-2xl"
                :title="$t('location_change_range')"
                @open-details="() => {}"
              />
              <PaymentCardInfo
                icon="SvgoProfileUserCircle"
                icon-class="text-teal-700 !text-2xl"
                :title="'Машрабов Яхъё, +998 71 200 70 07'"
                @open-details="() => {}"
              />
              <PaymentCardInfo
                icon="SvgoProfileMessage"
                icon-class="!text-blue-100 !text-2xl"
                :title="$t('courier_comment')"
                @open-details="() => {}"
              />
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
            <section class="space-y-2">SMTH</section>
          </PaymentCardInfoHeader>
        </div>
      </div>
    </Transition>
    <template #right>
      <section class="space-y-5">
        <CartCardFreeDelivery
          :free-delivery-price="90000"
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

const { locale } = useI18n()
const router = useRouter()
const cartStore = useCartStore()

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
</script>

<style scoped></style>
