<template>
  <div class="flex-y-center gap-2 justify-between rounded-xl px-4 py-3">
    <div class="flex-y-center gap-2">
      <div
        class="border bg-white border-white-100 w-16 relative h-[52px] rounded-10 px-0.5"
      >
        <NuxtImg
          :src="product?.main_image"
          class="w-full h-fit absolute -bottom-1 object-cover object-center"
        />
      </div>
      <div class="space-y-0.5">
        <NuxtLinkLocale
          :to="`/project/${product?.id}`"
          class="text-[13px] font-semibold hover:text-orange transition-300 leading-none text-dark"
        >
          {{ product?.name }}
        </NuxtLinkLocale>
        <p class="text-xs font-medium leading-130 text-gray-400">
          {{ product?.weight }} {{ product?.weight_measure }}
        </p>
      </div>
    </div>
    <div class="w-24 text-right">
      <BaseButton
        v-if="count < 1"
        class="w-24"
        :text="$t('to_basket')"
        variant="outline"
        @click="count++"
      />
      <MainCardCounter
        v-else
        v-model="count"
        :default-count="count"
        :max="product?.max_quantity ?? 100000"
        class="w-24 border-none bg-white-100"
        readonly
      />
      <p
        v-if="count > 0"
        class="mt-1 text-xs font-medium text-dark leading-none"
      >
        {{ formatMoneyDecimal(count * product?.price ?? 0, 0) }}
        <span class="text-[10px] font-medium leading-130 text-dark">UZS</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  product: any
}

defineProps<Props>()
const count = ref(0)
</script>

<style scoped></style>
