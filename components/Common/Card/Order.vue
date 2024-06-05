<template>
  <div>
    <div class="p-3 bg-gray-300 rounded-xl">
      <!-- Card header -->
      <div
        class="grid gap-[0.9px] h-40 rounded-lg border border-white-100 cursor-pointer overflow-hidden"
        :class="[
          imagesLen > 2 ? 'grid-rows-2' : 'grid-rows-1',
          { 'grid-cols-2': imagesLen > 1 },
        ]"
      >
        <div
          v-for="(image, i) in images"
          :key="i"
          class="relative flex items-center bg-white"
          :class="{
            'col-span-2': i == 2 && imagesLen == 3,
          }"
        >
          <img :src="image" alt="product-image" class="max-h-full mx-auto" />

          <!-- 4-image overlaps shade for over 4 img case -->
          <div
            v-if="i === 3 && imagesLen > 4"
            class="absolute top-0 flex items-center justify-center w-full h-full bg-dark/60"
          >
            <span class="text-lg text-white font-bold"
              >+{{ imagesLen - 3 }}</span
            >
          </div>
        </div>
      </div>

      <!-- Card body -->
      <div class="my-3">
        <div class="flex justify-between mb-1.5">
          <p class="text-gray-100 text-xs font-semibold leading-130">
            {{ $t('order_number') }}:
          </p>
          <span class="text-sm font-bold text-dark leading-130">#120021</span>
        </div>

        <CommonCardBadge :type="badgeType" />

        <hr class="my-2.5 border-gray-200" />

        <div class="flex justify-between mb-1.5 text-xs">
          <p class="text-gray-100 font-semibold leading-130">
            {{ $t('order_date') }}:
          </p>
          <span class="font-bold text-dark leading-130">04.01.2024</span>
        </div>

        <div class="flex items-end text-dark font-extrabold">
          <p class="text-xl mr-0.5 leading-130">50 090</p>
          <span class="text-[15px] leading-140">UZS</span>
        </div>
      </div>

      <!-- Card footer -->
      <BaseButton
        variant="outline"
        :text="$t('more_info_product')"
        class="group bg-white border-white-100 rounded-[10px] w-full font-semibold"
        main-class="justify-between text-[13px] leading-120"
      >
        <template #suffix>
          <SvgoCommonChevron
            class="rotate-180 text-gray transition-300 group-hover:text-white"
          />
        </template>
      </BaseButton>
    </div>

    <!-- Offer reorder -->
    <BaseButton
      v-if="offerReorder"
      variant="secondary"
      :text="$t('reorder')"
      class="w-full mt-3 font-semibold"
    >
      <template #prefix>
        <SvgoCommonRefresh />
      </template>
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import type { TOrderBadgeTypes } from '~/types/components/card'

interface Props {
  badgeType: TOrderBadgeTypes
  offerReorder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  offerReorder: false,
})

const productImages = [
  '/images/fake/cheesecake.webp',
  '/images/fake/coffee.webp',
  '/images/fake/kasha.webp',
  '/images/fake/nestle.webp',
  '/images/fake/pepsi.webp',
]

const imagesLen = productImages.length

// max 4 images
const images = computed(() => {
  if (imagesLen > 4) return productImages.slice(0, 4)
  else return productImages
})
</script>
