<template>
  <div class="w-full">
    <div class="grid grid-cols-2 gap-3">
      <a href="#" target="_blank">
        <img
          src="/images/fake/banner-1.webp"
          alt="banner"
          class="w-full max-h-[150px] h-full object-cover rounded-10"
        />
      </a>
      <a href="#" target="_blank">
        <img
          src="/images/fake/banner-2.webp"
          alt="banner"
          class="w-full max-h-[150px] h-full object-cover rounded-10"
        />
      </a>
    </div>
    <div class="w-full flex-y-center gap-2 mt-4">
      <NuxtLinkLocale to="/search" class="w-full">
        <FormInputSearch :placeholder="$t('search')" class="w-full !h-10" />
      </NuxtLinkLocale>
      <button
        class="w-10 h-10 rounded-lg bg-white-100 flex-center shrink-0 hover:bg-blue-100 transition-300"
        aria-label="list-button"
      >
        <IconList class="text-2xl text-blue-100" />
      </button>
    </div>
    <CommonSectionWrapper title="take_and_go" class="mt-4">
      <Transition name="fade" mode="out-in">
        <div :key="products?.loading" class="grid grid-cols-4 gap-x-4 gap-y-10">
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
        </div>
      </Transition>
    </CommonSectionWrapper>
    <CommonSectionWrapper title="popular_brands" class="my-6">
      <MainBrandsWrapper />
    </CommonSectionWrapper>
    <CommonSectionWrapper title="profitable_shelf" class="my-6">
      <Transition name="fade" mode="out-in">
        <div
          :key="discounts?.loading"
          class="grid grid-cols-4 gap-x-4 gap-y-10"
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
  </div>
</template>

<script setup lang="ts">
import IconList from '~/assets/icons/Common/list.svg'
import { useMainStore } from '~/store/main'

const mainStore = useMainStore()

const products = computed(() => mainStore.products)
const discounts = computed(() => mainStore.discounts)

if (!products.value?.list.length) {
  mainStore.fetchProducts()
}

if (!discounts.value?.list.length) {
  mainStore.fetchDiscounts()
}
</script>
