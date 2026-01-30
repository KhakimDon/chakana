<template>
  <div>
    <CommonSectionWrapper title="take_and_go" class="mt-4">
      <Transition name="fade" mode="out-in">
        <div
          :key="nearbyStores?.loading"
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
        >
          <template v-if="nearbyStores?.loading">
            <MainCardStoreCardLoading v-for="key in 6" :key="key" />
          </template>
          <template
            v-else-if="!nearbyStores?.loading && nearbyStores?.list.length"
          >
            <MainCardStoreCard
              v-for="store in nearbyStores.list"
              :key="store.id"
              :store="store"
            />
          </template>
        </div>
      </Transition>
    </CommonSectionWrapper>
  </div>
</template>

<script setup lang="ts">
// Stores section instead of products
import { useMainStore } from '~/store/main'

const mainStore = useMainStore()

const nearbyStores = computed(() => mainStore.nearbyStores)

// Загружаем магазины вместо продуктов
if (!nearbyStores.value?.list.length && !nearbyStores.value?.loading) {
  mainStore.fetchNearbyStores()
}
</script>

<style scoped></style>
