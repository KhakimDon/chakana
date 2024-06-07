<template>
  <div class="w-full">
    <Swiper v-bind="swiperConfig" class="!w-full !pt-[18px]">
      <SwiperSlide
        v-for="(variant, key) in [...variants, ...variants]"
        :key
        class="!w-16"
      >
        <div class="border-2 border-gray rounded-10 h-[46px] relative">
          <NuxtImg
            :src="variant.main_image"
            class="absolute-x object-contain bottom-0 w-[56px]"
          />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'

interface Props {
  variants: {
    id: number
    name: string
    main_image: string
  }[]
}

defineProps<Props>()

const swiperConfig = {
  slidesPerView: 'auto',
  spaceBetween: 16,
}
</script>

<style>
.swiper-wrapper {
  min-width: 0 !important;
}
</style>
