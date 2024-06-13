<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('discounts')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <p class="text-sm font-medium leading-tight text-dark">
        {{ $t('all_discounts_info') }}
      </p>
      <div>
        <div
          v-for="(product, index) in discount?.detail?.products"
          :key="index"
          class="flex-y-center justify-between border-b border-white-100 py-3"
        >
          <div class="space-y-1">
            <p class="text-xs font-semibold leading-130 text-dark line-clamp-2">
              {{ product?.name }}
            </p>
          </div>
          <div class="flex-y-center flex-col items-end">
            <p
              class="text-dark leading-120 font-medium text-xs bg-[#FFE81B] rounded p-1"
            >
              -{{ product?.discount_percent }}%
            </p>
            <p class="text-xs text-green font-medium leading-none">
              <span class="text-base font-semibold leading-tight"
                >-{{ formatMoneyDecimal(product?.discount ?? 0, 0) }}</span
              >
              UZS
            </p>
          </div>
        </div>
        <div
          class="flex-y-center justify-between border-b border-white-100 py-3"
        >
          <div class="space-y-1">
            <p class="text-xs font-medium text-gray-100 leading-130">
              {{ $t('promo_code') }}
            </p>
            <p class="text-xs font-semibold leading-130 text-dark">
              {{ discount?.detail?.promo_code?.code }}
            </p>
          </div>
          <p class="text-xs text-green font-medium leading-none">
            <span class="text-base font-semibold leading-tight"
              >-{{
                formatMoneyDecimal(discount?.detail?.promo_code?.reward ?? 0, 0)
              }}</span
            >
            UZS
          </p>
        </div>
        <div class="flex-y-center justify-between pt-3 relative">
          <div class="border border-dashed w-full absolute z-0 top-10"></div>
          <p
            class="text-base z-10 font-extrabold bg-white p-2 pl-0 leading-tight text-dark"
          >
            {{ $t('total') }}
          </p>
          <p
            class="text-xl z-10 font-extrabold leading-relaxed p-2 bg-white pr-0 text-red"
          >
            -{{ formatMoneyDecimal(discount?.detail?.total ?? 0, 0) }}
            <span class="text-[15px] font-extrabold leading-[21px]">UZS</span>
          </p>
        </div>
      </div>
      <BaseButton
        class="!py-3 w-full !mt-5"
        :loading
        :text="$t('its_clear')"
        size="md"
        @click="emit('update:modelValue', false)"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  modelValue: boolean
  promoCode: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const cartOrderStore = useCartOrderStore()

const discount = computed(() => cartOrderStore.discount)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      cartOrderStore.getCartDiscountDetail(props.promoCode?.id)
    }
  }
)
</script>
