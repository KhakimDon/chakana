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
        <div :key="loading" class="grid grid-cols-5 gap-x-4 gap-y-10">
          <template v-if="loading">
            <MainCardLoading v-for="key in 16" :key />
          </template>
          <template v-else-if="!loading && data?.length">
            <MainCard v-for="(card, index) in data" :key="index" :card />
          </template>
          <template v-else>
            <CommonNoData class="col-span-4" />
          </template>
        </div>
      </Transition>
    </CommonSectionWrapper>
  </div>
</template>

<script setup lang="ts">
import IconChevron from 'assets/icons/Common/chevron.svg'

import type { IProduct } from '~/types/products.js'

const route = useRoute()

const { data, loading } = await useAsyncData<IProduct>('brands-detail', () =>
  useApi().$get(`/brand/products/${route.params.id}`)
)

const { data: single } = await useAsyncData<IProduct>('brands-single', () =>
  useApi().$get(`/brand/${route.params.id}`)
)

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
