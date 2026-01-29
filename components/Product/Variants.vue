<template>
  <div class="w-full">
    <Swiper
      :key="trigger"
      v-bind="thumbSettings"
      class="!w-full relative"
      :space-between="8"
      @swiper="setThumbsSwiper"
      @slide-change="onChange"
    >
      <SwiperSlide
        v-for="(item, index) in variants"
        :key="index"
        class="!w-[72px] cursor-pointer"
      >
        <NuxtLinkLocale
          :to="`/product/${item?.id}`"
          class="block"
        >
          <div
            class="rounded-xl h-[72px] relative bg-white border-2 transition-300 flex-center overflow-hidden"
            :class="activeItemId === item?.id ? 'border-[#ED2024]' : 'border-gray-200 hover:border-gray-300'"
          >
            <NuxtImg
              :src="item?.main_image"
              :alt="item?.name"
              class="w-14 h-14 object-contain"
              loading="lazy"
            />
          </div>
          <p 
            class="text-[10px] text-center line-clamp-2 mt-1.5 leading-tight"
            :class="activeItemId === item?.id ? 'text-dark font-semibold' : 'text-gray-100'"
          >
            {{ item.name }}
          </p>
        </NuxtLinkLocale>
      </SwiperSlide>
      <button
        class="bg-white btn-arrow btn-arrow-prev absolute top-1/3 z-10 -left-2 p-1.5 shadow-lg rounded-full opacity-0 pointer-events-none transition-300"
        :class="{
          '!opacity-100 !pointer-events-auto': !isBeginning && variants?.length > 5,
        }"
      >
        <IconArrow class="icon-chevron text-lg rotate-180" />
      </button>
      <button
        class="bg-white btn-arrow btn-arrow-next absolute top-1/3 z-10 -right-2 p-1.5 shadow-lg rounded-full opacity-0 pointer-events-none transition-300"
        :class="{
          '!opacity-100 !pointer-events-auto': !isEnd && variants?.length > 5,
        }"
      >
        <IconArrow class="icon-chevron text-lg" />
      </button>
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
  name: string
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

<style scoped>
.swiper-wrapper {
  min-width: 0 !important;
}

.btn-arrow {
  border: 1px solid #f2f2f2;
  background: #fff;
  box-shadow: 0px 4px 16px 0px rgba(28, 28, 28, 0.12);
}

.btn-arrow:hover {
  border-color: #ff831b;
}
</style>
