<template>
  <div>
    <CommonSectionWrapper title="take_and_go" class="mt-4">
      <Transition name="fade" mode="out-in">
        <div
          :key="newProducts?.loading"
          class="grid grid-cols-4 gap-x-4 gap-y-10"
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
              @click="selectProduct(card)"
            />
          </template>
        </div>
      </Transition>
    </CommonSectionWrapper>
    <MainModalInfo
      :show="showProduct"
      :product="selectedProduct"
      @close="showProduct = false"
    />
  </div>
</template>

<script setup lang="ts">
// New products section
import { useMainStore } from '~/store/main'
import type { IProduct } from '~/types/products'

const mainStore = useMainStore()

const newProducts = computed(() => mainStore.products)
const showProduct = ref(false)
const selectedProduct = ref<IProduct | null>(null)

function selectProduct(product: IProduct) {
  selectedProduct.value = product
  showProduct.value = true
}

if (!newProducts.value?.list.length) {
  mainStore.fetchProducts()
}
</script>

<style scoped></style>
