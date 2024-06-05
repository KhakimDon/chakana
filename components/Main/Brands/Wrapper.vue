<template>
  <div>
    <Transition name="fade" mode="out-in">
      <div :key="loading">
        <Swiper v-if="!loading" v-bind="swiperConfig">
          <SwiperSlide v-for="(card, key) in list" :key class="!w-[152px]">
            <MainBrandsCard :card />
          </SwiperSlide>
        </Swiper>
        <div v-else class="flex-y-center gap-3">
          <MainBrandsCardLoading v-for="key in 3" :key />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'

import { brands } from '~/data'
import type { IBrand } from '~/types'

interface Props {
  list: IBrand[]
  loading: boolean
}

defineProps<Props>()

const swiperConfig = {
  slidesPerView: 'auto',
  spaceBetween: 12,
  loop: true,
}
</script>
