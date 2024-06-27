<template>
  <div class="w-full">
    <Transition v-if="useMobile('desktop')" name="fade" mode="out-in">
      <div :key="banners?.loading" class="h-[150px] md:mt-0">
        <div
          v-if="!banners?.loading"
          class="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <a
            v-for="(banner, index) in banners?.list"
            :key="index"
            :href="banner?.redirect_url"
            target="_blank"
          >
            <img
              :src="banner?.image"
              alt="banner"
              class="w-full max-h-[150px] h-full object-cover rounded-10"
            />
          </a>
        </div>
        <div v-else class="grid grid-cols-2 gap-3 shimmer-wrapper">
          <div class="shimmer w-full h-[150px] rounded-10" />
          <div class="shimmer w-full h-[150px] rounded-10" />
        </div>
      </div>
    </Transition>
    <Transition v-else name="fade" mode="out-in">
      <div :key="banners?.loading" class="h-[150px] md:mt-0">
        <Swiper v-if="!banners?.loading" :space-between="12">
          <SwiperSlide v-for="(banner, index) in banners?.list" :key="index">
            <a :href="banner?.redirect_url" target="_blank">
              <img
                :src="banner?.image"
                alt="banner"
                class="w-full max-h-[150px] h-full object-cover rounded-10"
              />
            </a>
          </SwiperSlide>
        </Swiper>
        <div v-else class="gap-3 shimmer-wrapper">
          <div class="shimmer w-full h-[150px] rounded-10" />
        </div>
      </div>
    </Transition>
    <MainCategories v-if="!useMobile('desktop')" />
    <div v-if="useMobile('desktop')" class="w-full flex-y-center gap-2 mt-4">
      <NuxtLinkLocale to="/search" class="w-full" @click.stop>
        <FormInputSearch :placeholder="$t('search')" class="w-full !h-10" />
      </NuxtLinkLocale>
      <NuxtLinkLocale
        to="/search/list"
        class="w-10 h-10 rounded-lg bg-white-100 flex-center shrink-0 hover:bg-blue-100/10 transition-300"
        aria-label="list-button"
      >
        <IconList class="text-2xl text-blue-100" />
      </NuxtLinkLocale>
    </div>
    <CommonSectionWrapper title="take_and_go" class="mt-4">
      <Transition name="fade" mode="out-in">
        <div
          :key="discounts?.loading"
          class="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-10"
        >
          <template v-if="discounts?.loading">
            <MainCardLoading v-for="key in 16" :key />
          </template>
          <template v-else-if="!discounts?.loading && discounts?.list.length">
            <MainCard
              v-for="(card, index) in discounts?.list"
              :key="index"
              :card
            />
          </template>
        </div>
      </Transition>
    </CommonSectionWrapper>
    <CommonSectionWrapper title="popular_brands" class="my-6">
      <MainBrandsWrapper
        :list="popularBrands?.list"
        :loading="popularBrands?.loading"
      />
    </CommonSectionWrapper>
    <CommonSectionWrapper title="profitable_shelf" class="my-6">
      <Transition name="fade" mode="out-in">
        <div
          :key="products?.loading"
          class="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-10"
        >
          <template v-if="products?.loading">
            <MainCardLoading v-for="key in 16" :key />
          </template>
          <template v-else-if="!products?.loading && products?.list.length">
            <MainCard
              v-for="(card, index) in products?.list"
              :key="index"
              :card
            />
          </template>
          <template v-if="products?.params?.loading">
            <MainCardLoading v-for="key in 10" :key />
          </template>
        </div>
      </Transition>
      <div
        v-if="
          products.params?.total > products?.list.length &&
          !products?.loading &&
          !products?.params?.loading
        "
        ref="target"
      />
    </CommonSectionWrapper>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { Swiper, SwiperSlide } from 'swiper/vue'

import IconList from '~/assets/icons/Common/list.svg'
import { useMainStore } from '~/store/main'

const mainStore = useMainStore()

const products = computed(() => mainStore.products)
const discounts = computed(() => mainStore.discounts)
const popularBrands = computed(() => mainStore.popularBrands)
const banners = computed(() => mainStore.banners)

if (!products.value?.list.length) {
  mainStore.fetchProducts()
}

if (!discounts.value?.list.length) {
  mainStore.fetchDiscounts()
}

if (!popularBrands.value?.list.length) {
  mainStore.fetchPopularBrands()
}

if (!banners.value?.list.length) {
  mainStore.fetchBanners()
}

const target = ref<HTMLElement | null>(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    mainStore.fetchProducts(false)
  }
})
</script>
