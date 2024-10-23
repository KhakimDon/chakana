<template>
  <PaymentCardInfoHeader :title="$t('additional')">
    <section class="space-y-2">
      <PaymentCardInfo
        :no-clickable="!!cartOrderStore.orderDetail?.promo_code_id"
        :title="
          !cartOrderStore.orderDetail?.promo_code_id ? $t('promo_code') : ''
        "
        icon="SvgoProfileTicket"
        icon-class="text-orange !text-2xl"
        @open-details="editPromo = true"
      >
        <div
          v-if="cartOrderStore.orderDetail?.promo_code_id"
          class="px-2 py-1 bg-orange flex-y-center gap-1 rounded-md text-white"
        >
          <i18n-t
            class="text-white text-xs cursor-pointer select-none font-semibold leading-none"
            keypath="promo_badge"
            scope="global"
            tag="p"
            @click="showDetails"
          >
            <template #text>
              <span class="text-white text-xs font-extrabold leading-none">
                ({{ selectedPromoCode?.discount > 0 ? '-' : '' }}
                {{ formatMoneyDecimal(promoInfo?.discount ?? 0, 0) }}
                UZS)
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
  <OrderInfoEditPromocode
    v-model="editPromo"
    :default-info="cartOrderStore.orderDetail"
    @save="$emit('save', $event)"
  />
</template>

<script lang="ts" setup>
import { useCartOrderStore } from '~/store/cart_order.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  defaultData: any
}

const props = defineProps<Props>()

interface Emits {
  (e: 'save', data: any): void
}

const emit = defineEmits<Emits>()

const editPromo = ref(false)

const promoInfo = computed(() => props.defaultData?.promo_info)

const cartOrderStore = useCartOrderStore()
const promoCodes = computed(() => {
  return cartOrderStore.promoCodes
})

const selectedPromoCodeId = ref()

const selectedPromoCode = computed(() => {
  return promoCodes.value?.list?.find(
    (promo) => promo?.id === selectedPromoCodeId.value
  )
})

const removePromoCode = () => {
  cartOrderStore.getCartDetail()
  emit('save', {
    promo_code_id: 0,
    promo_info: null,
  })
}

const openDetail = ref(false)
const showDetails = () => {
  openDetail.value = true
}
</script>

<style scoped></style>
