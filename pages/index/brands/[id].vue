<template>
  <div>
    <CommonSectionWrapper :title="single.title" class="my-6">
      <template #beforeTitle>
        <NuxtLinkLocale to="/brands">
          <IconChevron
            class="text-2xl text-dark group-hover:-translate-x-1 transition-300"
          />
        </NuxtLinkLocale>
      </template>
      <Transition name="fade" mode="out-in">
        <div
          v-if="loading.list || list?.length"
          :key="loading.list"
          class="grid grid-cols-5 gap-x-4 gap-y-10"
        >
          <template v-if="loading?.list">
            <MainCardLoading v-for="key in 16" :key />
          </template>
          <template v-else-if="list">
            <MainCard v-for="(card, index) in list" :key="index" :card />
          </template>
          <template v-else>
            <CommonNoData class="col-span-4" />
          </template>
        </div>
      </Transition>
    </CommonSectionWrapper>
    <div ref="infiniteScrollTrigger" class="h-1"></div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import IconChevron from 'assets/icons/Common/chevron.svg'

import type { IProduct } from '~/types/products.js'

const route = useRoute()

const { list, loading, loadMore } = useListFetcher<IProduct>(
  `/brand/products/${route.params.id}`,
  16,
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
