<template>
  <BaseModal
    v-bind="{ show }"
    no-header
    body-class="!max-w-[424px]"
    @close="$emit('close')"
  >
    <div class="flex justify-end w-full mb-5">
      <IconClose
        class="text-2xl text-dark cursor-pointer hover:text-red transition-300"
        @click="$emit('close')"
      />
    </div>
    <div class="w-full h-[278px] rounded-10 bg-white-100 mb-4 flex-center">
      <NuxtImg
        :src="product?.main_image"
        class="w-full h-full object-contain max-w-[296px]"
      />
    </div>

    <h3 class="text-base leading-130 font-bold text-dark">
      {{ product?.name }}
    </h3>
    <p class="mt-1.5 text-xs leading-130 font-medium text-gray-100 mb-4">
      {{ product?.weight }} {{ product?.weight_measure }}
    </p>

    <div>
      <div class="flex items-end gap-1">
        <p
          v-if="product?.discount_price"
          class="text-lg leading-4 font-medium text-gray-100 line-through"
        >
          {{ formatMoneyDecimal(product?.price) }}
        </p>
        <span
          class="text-xs leading-[94%] font-medium text-gray-100 line-through"
          >UZS</span
        >
      </div>
      <p
        class="text-[28px] leading-122 font-bold text-green mt-1"
        :class="{ '!text-red !mt-0': product?.discount_price }"
      >
        {{ formatMoneyDecimal(product?.discount_price ?? product?.price) }}
        <span class="text-[22px] font-semibold leading-130">UZS</span>
      </p>
    </div>

    <div class="w-full h-px bg-white-100 my-4" />

    <div class="flex-y-center gap-2.5 mb-5">
      <IconInfo class="text-green text-2xl" />

      <p class="text-sm leading-130 font-semibold text-dark">
        {{ $t('product_to_card_text') }}
      </p>
    </div>

    <BaseButton
      v-if="count < 1"
      class="w-full !h-11"
      :text="$t('to_basket')"
      variant="secondary"
      @click="count++"
    />
    <MainCardCounter
      v-else
      v-model="count"
      :default-count="count"
      readonly
      class="bg-white-100 !h-11"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import IconClose from '~/assets/icons/Common/close.svg'
import IconInfo from '~/assets/icons/Common/info.svg'
import type { IProduct } from '~/types/products'
import { formatMoneyDecimal } from '~/utils/functions/common'

interface Props {
  show?: boolean
  product?: IProduct
}

defineProps<Props>()
defineEmits(['close'])

const count = ref(0)
</script>
