<template>
  <div class="w-full mt-4 md:mt-2">
    <div>
      <div class="flex items-start gap-1">
        <p class="text-gray-100 text-xs">{{ $t('vid') }}:</p>
        <p class="text-dark text-xs">variant</p>
      </div>
    </div>
    <Swiper
      :key="trigger"
      v-bind="thumbSettings"
      class="!w-full !pt-[18px] relative"
      :space-between="6"
      @swiper="setThumbsSwiper"
      @slide-change="onChange"
    >
      <SwiperSlide
        v-for="(item, index) in variants"
        :key="index"
        class="!w-16 cursor-pointer"
      >
        <NuxtLinkLocale
          :to="`/product/${item?.id}`"
          class="rounded-10 h-[46px] relative bg-white-100 opacity-60 border-2 border-transparent block"
          :class="{
            '!border-orange !opacity-100': activeItemId === item?.id,
          }"
        >
          <NuxtImg
            :src="item?.main_image"
            alt="card-image"
            class="absolute-x object-contain top-[-15px] w-[56px]"
            loading="lazy"
          />
        </NuxtLinkLocale>
        <p class="text-[10px] text-center opacity-60 line-clamp-2 mt-2">
          {{ item.name }}
        </p>
      </SwiperSlide>
      <button
        class="bg-white btn-arrow btn-arrow-prev absolute top-1/2 z-10 left-0 p-1 opacity-0 pointer-events-none"
        :class="{
          '!opacity-100 !pointer-events-auto':
            !isBeginning && variants?.length > 8,
        }"
      >
        <IconArrow class="icon-chevron text-xl rotate-180" />
      </button>
      <button
        class="bg-white btn-arrow btn-arrow-next absolute top-1/2 z-10 right-0 p-1 opacity-0 pointer-events-none"
        :class="{
          '!opacity-100 !pointer-events-auto': !isEnd && variants?.length > 8,
        }"
      >
        <IconArrow class="icon-chevron text-xl" />
      </button>
      <span
        class="thumb-gradient left-0 pointer-events-none"
        :class="{
          'pointer-events-none opacity-0': isBeginning || variants?.length < 8,
        }"
      />
      <span
        class="thumb-gradient reverse right-0 pointer-events-none"
        :class="{
          'pointer-events-none opacity-0': isEnd || variants?.length < 8,
        }"
      />
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Navigation } from 'swiper/modules'
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

const route = useRoute()
const activeItemId = computed(() =>
  route.params.id ? Number(route.params.id) : 0
)

const activeIndex = computed(() =>
  props?.variants.findIndex((item) => item?.id === activeItemId.value)
)

const thumbSettings = {
  slidesPerView: 'auto',
  spaceBetween: 6,
  initialSlide: activeIndex.value,
  navigation: {
    nextEl: '.btn-arrow-next',
    prevEl: '.btn-arrow-prev',
  },
  watchSlidesProgress: true,
  modules: [Navigation],
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

const trigger = ref(0)

onMounted(() => {
  setTimeout(() => {
    trigger.value++
  }, 500)
})
</script>

<style>
.swiper-wrapper {
  min-width: 0 !important;
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
