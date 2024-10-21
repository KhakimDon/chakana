<template>
  <section class="mb-24 space-y-6">
    <CommonSectionWrapper :title="single.title" class="my-6" title-link>
      <template #beforeTitle>
        <NuxtLinkLocale to="/brands">
          <IconChevron
            class="text-2xl text-dark group-hover:-translate-x-1 transition-300 group-hover:text-orange"
          />
        </NuxtLinkLocale>
      </template>
      <Transition mode="out-in" name="fade">
        <div
          :key="loading.list"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10"
        >
          <template v-if="loading?.list">
            <MainCardLoading v-for="key in 16" :key />
          </template>
          <template v-else-if="list?.length">
            <MainCard v-for="(card, index) in list" :key="index" :card />
          </template>
          <template v-else>
            <CommonNoData class="col-span-4" />
          </template>
          <template>
            <MainCardLoading v-for="key in 16" :key />
          </template>
        </div>
      </Transition>
      <div
        v-if="!loading?.list && !loading?.button && paginationData?.next"
        ref="infiniteScrollTrigger"
      />
      <MainModalInfo
        v-model="showProduct"
        :product="selectedProduct"
        @close="showProduct = false"
      />
    </CommonSectionWrapper>
  </section>
</template>
<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import IconChevron from 'assets/icons/Common/chevron.svg'

import type { IProduct } from '~/types/products.js'

const showProduct = ref(false)
const selectedProduct = ref<IProduct | null>(null)
const route = useRoute()

const { list, loading, loadMore, paginationData } = useListFetcher<IProduct>(
  `/brand/products/pagination/${route.params.id}`,
  25,
  true
)

const { data: single } = await useAsyncData<IProduct>('brands-single', () =>
  useApi().$get(`/brand/${route.params.id}`)
)

const infiniteScrollTrigger = ref<HTMLElement | null>(null)

useIntersectionObserver(infiniteScrollTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting && !loading.list) {
    loadMore()
  }
})

useSeoMeta({
  title: single.value.title,
  description: single.value.title,
  ogTitle: single.value.title,
  twitterTitle: `Xolodilnik`,
  twitterCard: 'summary',
  twitterSite: '@xolodilnik',
  ogImage: single.value.image,
  twitterImage: '/og.png',
})
</script>

<style scoped></style>
