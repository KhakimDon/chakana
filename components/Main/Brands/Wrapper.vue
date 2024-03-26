<template>
  <Swiper v-bind="swiperConfig">
    <SwiperSlide v-for="(card, key) in brands" :key class="!w-[128px]">
      <MainBrandsCard :card />
    </SwiperSlide>
  </Swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import {brands} from "~/data";

const swiperConfig = {
  slidesPerView: 'auto',
  spaceBetween: 12,
  loop: true,
}
</script>
