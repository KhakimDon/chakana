<template>
  <section>
    <CommonSectionWrapper
      title="maybe_something_else"
      class="my-10"
      :class="wrapperClass"
    >
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
  </section>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

import { useMainStore } from '~/store/main.js'

interface Props {
  wrapperClass?: string
}
defineProps<Props>()

const mainStore = useMainStore()

const products = computed(() => mainStore.products)

// Fetch products
if (!products.value?.list.length) {
  mainStore.fetchProducts()
}

const target = ref<HTMLElement | null>(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    mainStore.fetchProducts(false)
  }
})
</script>

<style scoped></style>
