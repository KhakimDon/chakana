<template>
  <div class="w-full">
    <Transition name="fade" mode="out-in">
      <div :key="banners?.loading" class="h-[150px]">
        <div v-if="!banners?.loading" class="grid grid-cols-2 gap-3">
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
    <div class="w-full flex-y-center gap-2 mt-4">
      <NuxtLinkLocale to="/search" class="w-full" @click.stop>
        <FormInputSearch :placeholder="$t('search')" class="w-full !h-10" />
      </NuxtLinkLocale>
      <button
        class="w-10 h-10 rounded-lg bg-white-100 flex-center shrink-0 hover:bg-blue-100/10 transition-300"
        aria-label="list-button"
      >
        <IconList class="text-2xl text-blue-100" />
      </button>
    </div>
    <CommonSectionWrapper title="take_and_go" class="mt-4">
      <Transition name="fade" mode="out-in">
        <div
          :key="discounts?.loading"
          class="grid grid-cols-5 gap-x-4 gap-y-10"
        >
          <template v-if="discounts?.loading">
            <MainCardLoading v-for="key in 16" :key />
          </template>
          <template v-else-if="!discounts?.loading && discounts?.list.length">
            <MainCard
              v-for="(card, index) in discounts?.list"
              :key="index"
              :card
              @click="selectProduct(card)"
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
        <div :key="products?.loading" class="grid grid-cols-5 gap-x-4 gap-y-10">
          <template v-if="products?.loading">
            <MainCardLoading v-for="key in 16" :key />
          </template>
          <template v-else-if="!products?.loading && products?.list.length">
            <MainCard
              v-for="(card, index) in products?.list"
              :key="index"
              :card
              @click="selectProduct(card)"
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
    <MainModalInfo
      :show="showProduct"
      :product="selectedProduct"
      @close="showProduct = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

import IconList from '~/assets/icons/Common/list.svg'
import { useMainStore } from '~/store/main'
import type { IProduct } from '~/types/products'

const mainStore = useMainStore()

const showProduct = ref(false)
const selectedProduct = ref<IProduct | null>(null)

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
function selectProduct(product: IProduct) {
  selectedProduct.value = product
  showProduct.value = true
}

const target = ref<HTMLElement | null>(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    mainStore.fetchProducts(false)
  }
})
</script>
