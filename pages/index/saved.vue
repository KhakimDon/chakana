<template>
  <section class="mb-24 space-y-6">
    <CommonSectionWrapper title="saved">
      <template #header>
        <div class="flex items-center group" @click="router.back()">
          <IconChevron
            class="text-gray group-hover:-translate-x-1 transition-300 group-hover:text-orange"
          />
          <p
            class="text-gray-100 text-sm group-hover:text-orange transition-300"
          >
            {{ $t('go_back') }}
          </p>
        </div>
      </template>
      <Transition name="fade" mode="out-in">
        <div
          :key="loading?.list"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10"
        >
          <template v-if="loading.list">
            <MainCardLoading v-for="key in 16" :key />
          </template>
          <template v-else-if="list?.length">
            <MainCard
              v-for="(card, index) in list"
              :key="index"
              :card
              @open="selectProduct(card)"
            />
          </template>
          <template v-else-if="loading.list">
            <MainCardLoading v-for="key in 16" :key />
          </template>
          <template v-else>
            <CommonNoData class="col-span-4" />
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
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

import IconChevron from '~/assets/icons/Common/chevron.svg'
import type { IProduct } from '~/types/products.js'

const router = useRouter()

definePageMeta({
  middleware: ['auth'],
})

const { list, loading, loadMore, paginationData } = useListFetcher<IProduct>(
  `/saved/products`,
  5,
  true
)

const showProduct = ref(false)
const selectedProduct = ref<IProduct | null>(null)

function selectProduct(product: IProduct) {
  selectedProduct.value = product
  showProduct.value = true
}

const infiniteScrollTrigger = ref<HTMLElement | null>(null)

useIntersectionObserver(infiniteScrollTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting && !loading.list) {
    loadMore()
  }
})
</script>
<style scoped></style>
