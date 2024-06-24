<template>
  <div class="w-full mt-4 md:mt-2">
    <div>
      <Transition name="fade-in">
        <swiper
          v-if="variants?.length"
          :modules="[Thumbs, Navigation]"
          :thumbs="{ swiper: thumbsSwiper }"
        >
          <div class="flex items-center gap-1">
            <p class="text-gray-100 text-xs">Вид:</p>
            <p class="text-dark text-xs">{{ variant }}</p>
          </div>
        </swiper>
      </Transition>
    </div>
    <swiper
      v-bind="thumbSettings"
      class="!w-full !pt-[18px] relative"
      :space-between="6"
      @swiper="setThumbsSwiper"
      @slide-change="onChange"
    >
      <swiper-slide
        v-for="(item, index) in variants"
        :key="index"
        class="!w-16 cursor-pointer"
        @click="variantsName(item)"
      >
        <div
          class="rounded-10 h-[46px] relative bg-white-100 image-block opacity-60 border-2 border-transparent"
        >
          <NuxtImg
            :src="item.main_image"
            alt="card-image"
            class="absolute-x object-contain top-[-15px] w-[56px]"
            loading="lazy"
          />
        </div>
        <p class="text-[10px] text-center opacity-60 line-clamp-2 mt-2">
          {{ item.name }}
        </p>
      </swiper-slide>
      <button
        v-if="!isEnd && variants?.length"
        class="bg-white btn-arrow absolute top-1/2 z-10 right-0 p-1"
        @click="slideNext"
      >
        <IconArrow class="icon-chevron text-xl" />
      </button>
      <button
        v-if="!isBeginning && variants?.length"
        class="bg-white btn-arrow absolute top-1/2 z-10 left-0 p-1"
        @click="slidePrev"
      >
        <IconArrow class="icon-chevron text-xl rotate-180" />
      </button>
      <span
        class="thumb-gradient left-0"
        :class="{ 'pointer-events-none opacity-0': isBeginning }"
      />
      <span
        class="thumb-gradient reverse right-0"
        :class="{ 'pointer-events-none opacity-0': isEnd }"
      />
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import IconArrow from '~/assets/icons/Common/arrow.svg'

interface Variant {
  id: number
  name: string
  main_image: string
}

const props = defineProps<{
  variants: Variant[]
}>()

const thumbSettings = {
  slidesPerView: 12,
  spaceBetween: 6,
  breakpoints: {
    640: {
      slidesPerView: 5,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 6,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 6,
      spaceBetween: 4,
    },
  },
  watchSlidesProgress: true,
  modules: [Thumbs, Navigation],
}
const thumbsSwiper = ref<Swiper | null>(null)
const setThumbsSwiper = (swiper: Swiper) => {
  thumbsSwiper.value = swiper
}

const isBeginning = ref(true)
const isEnd = ref(false)
const onChange = (e: Swiper) => {
  isBeginning.value = e.isBeginning
  isEnd.value = e.isEnd
  if (e.visibleSlidesIndexes.includes(0)) {
    isBeginning.value = true
  }
  if (e.visibleSlidesIndexes.includes(e.slides.length - 1)) {
    isEnd.value = true
  }
}

const variant = ref(props?.variants[0]?.name)

const variantsName = (e: Variant) => {
  variant.value = e.name
}

const slideNext = () => {
  if (thumbsSwiper.value) {
    thumbsSwiper.value.slideNext()
  }
}

const slidePrev = () => {
  if (thumbsSwiper.value) {
    thumbsSwiper.value.slidePrev()
  }
}
</script>

<style>
.swiper-wrapper {
  min-width: 0 !important;
}

.swiper-slide-thumb-active .image-block {
  border: 2px solid #ff831b !important;
  border-radius: 10px !important;
  opacity: 100%;
}

.swiper-slide-thumb-active p {
  opacity: 100%;
}

.thumb-gradient {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 86px;
  height: 100%;
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
  z-index: 2;
  transition: all 0.3s;
}
.thumb-gradient.reverse {
  transform: rotateY(180deg);
}

.btn-arrow {
  border-radius: 100px;
  border: 1px solid #f2f2f2;
  background: #fff;
  box-shadow: 0px 4px 28px 0px rgba(28, 28, 28, 0.16);
}
</style>
