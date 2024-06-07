<template>
  <div class="flex flex-col justify-between gap-5 cursor-pointer">
    <div>
      <div
        class="w-full h-[113px] rounded-10 bg-white-100 flex-center relative"
        @click="$emit('open')"
      >
        <MainCardBadge
          class="absolute -top-2 left-2"
          :percent="card?.discountPercent"
          :type="card?.discountType"
        />
        <nuxt-img
          :src="getImageSize(card?.main_image, 'small')"
          alt="card-image"
          class="w-[95px] h-full object-contain"
          loading="lazy"
        />
      </div>
      <p
        v-if="card?.discount_price"
        class="mt-2 text-xs leading-[12px] font-medium text-gray-100 line-through"
      >
        {{ formatMoneyDecimal(card?.price) }}
        <span class="text-[11px] font-[150%]">UZS</span>
      </p>
      <p
        class="mt-2 text-sm leading-122 font-bold text-green"
        :class="{ '!text-red !mt-0': card?.discount_price }"
      >
        {{ formatMoneyDecimal(card?.discount_price ?? card?.price) }}
        <span class="text-[11px] font-[150%]">UZS</span>
      </p>
      <NuxtLinkLocale
        class="mt-2 text-xs leading-122 text-dark font-semibold line-clamp-2 hover:text-orange transition-300"
        :to="'/product/' + card?.id"
      >
        {{ card?.name }}
      </NuxtLinkLocale>
      <p class="mt-1.5 text-gray-100 font-medium text-xs leading-122">
        {{ card?.weight }} {{ card?.weight_measure }}
      </p>
    </div>
    <BaseButton
      v-if="count < 1"
      class="w-full"
      :text="$t('to_basket')"
      variant="outline"
      @click.stop="count++"
    />
    <MainCardCounter
      v-else
      v-model="count"
      :default-count="count"
      readonly
      @click.stop
    />
  </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/types/products'
import { formatMoneyDecimal, getImageSize } from '~/utils/functions/common'

interface Props {
  card: IProduct
}

defineProps<Props>()
defineEmits(['open'])

const count = ref(0)
</script>
