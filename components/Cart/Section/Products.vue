<template>
  <section>
    <CommonSectionWrapper
      title="maybe_something_else"
      class="my-10"
      :class="wrapperClass"
    >
      <Transition name="fade" mode="out-in">
        <div
          :key="nearbyStores?.loading"
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
        >
          <template v-if="nearbyStores?.loading">
            <MainCardStoreCardLoading v-for="key in 6" :key="key" />
          </template>
          <template v-else-if="!nearbyStores?.loading && nearbyStores?.list.length">
            <MainCardStoreCard
              v-for="store in nearbyStores.list"
              :key="store.id"
              :store="store"
            />
          </template>
        </div>
      </Transition>
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

// Используем магазины вместо продуктов
const nearbyStores = computed(() => mainStore.nearbyStores)

// Загружаем магазины вместо продуктов
if (!nearbyStores.value?.list.length && !nearbyStores.value?.loading) {
  mainStore.fetchNearbyStores()
}

const target = ref<HTMLElement | null>(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  // Убрано: больше не загружаем продукты при скролле
  // if (isIntersecting) {
  //   mainStore.fetchProducts(false)
  // }
})
</script>

<style scoped></style>
