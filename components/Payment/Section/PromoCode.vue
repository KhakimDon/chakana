<template>
  <PaymentCardInfoHeader :title="$t('additional')">
    <section class="space-y-2">
      <PaymentCardInfo
        icon="SvgoProfileTicket"
        icon-class="text-orange !text-2xl"
        :no-clickable="hasPromoCode"
        :title="!hasPromoCode ? $t('promo_code') : ''"
        @open-details="modalStore.promoModel = true"
      >
        <div
          v-if="hasPromoCode"
          class="px-2 py-1 bg-orange flex-y-center gap-1 rounded-md text-white"
        >
          <i18n-t
            keypath="promo_badge"
            tag="p"
            scope="global"
            class="text-white text-xs cursor-pointer select-none font-semibold leading-none"
            @click="showDetails"
          >
            <template #text>
              <span class="text-white text-xs font-extrabold leading-none">
                (
                {{ selectedPromoCode?.discount?.detail?.total > 0 ? '-' : '' }}
                {{ formatMoneyDecimal(selectedPromoCode?.discount ?? 0, 0) }}
                UZS)
              </span>
            </template>
          </i18n-t>
          <SvgoCommonClose
            class="bg-white/20 cursor-pointer text-white rounded-full p-0.5 text-sm"
            @click="removePromoCode(selectedPromoCode?.id ?? 0)"
          />
        </div>
      </PaymentCardInfo>
    </section>
  </PaymentCardInfoHeader>
  <PaymentModalPromoCode
    v-model="modalStore.promoModel"
    @confirm-promo-code="selectPromoCode"
  />
  <PaymentModalDiscountDetails
    v-model="openDetail"
    :promo-code="selectedPromoCode"
  />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const modalStore = useModalStore()
const hasPromoCode = ref(false)

const cartOrderStore = useCartOrderStore()
const promoCodes = computed(() => {
  if (cartOrderStore.orderDetail?.promo_code_id) {
    hasPromoCode.value = true
    selectedPromoCodeId.value = cartOrderStore.orderDetail?.promo_code_id
  }
  return cartOrderStore.promoCodes
})

const selectedPromoCodeId = ref()

const selectedPromoCode = computed(() => {
  return promoCodes.value?.list?.find(
    (promo) => promo?.id === selectedPromoCodeId.value
  )
})

watch(
  () => selectedPromoCodeId.value,
  (val) => {
    hasPromoCode.value = !!val
  }
)

const selectPromoCode = (code: number) => {
  selectedPromoCodeId.value = code
  hasPromoCode.value = true
  modalStore.promoModel = false
  cartOrderStore.orderDetail.promo_code_id = code
}

const removePromoCode = (code: number) => {
  hasPromoCode.value = false
  cartOrderStore.orderDetail.promo_code_id = code
  cartOrderStore.getCartDetailConfirm()
}

const openDetail = ref(false)
const showDetails = () => {
  openDetail.value = true
}
</script>

<style scoped></style>
