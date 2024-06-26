<template>
  <div>
    <CommonSectionWrapper title="take_and_go" class="mt-4">
      <Transition name="fade" mode="out-in">
        <div
          :key="newProducts?.loading"
          class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10"
        >
          <template v-if="newProducts?.loading">
            <MainCardLoading v-for="key in 16" :key />
          </template>
          <template
            v-else-if="!newProducts?.loading && newProducts?.list.length"
          >
            <MainCard
              v-for="(card, index) in newProducts?.list"
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
// New products section
import { useMainStore } from '~/store/main'

const mainStore = useMainStore()

const newProducts = computed(() => mainStore.products)

if (!newProducts.value?.list.length) {
  mainStore.fetchProducts()
}
</script>

<style scoped></style>
