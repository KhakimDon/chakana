<template>
  <LayoutWrapper has-fixed>
    <template #left>
      <div class="w-[202px]">
        <MainSidebar
          :loading="categoriesLoading"
          v-bind="{ categories, single }"
        />
      </div>
    </template>
    <Transition name="fade" mode="out-in">
      <div :key="$route.name">
        <NuxtPage />
      </div>
    </Transition>
    <template #right>
      <div class="sticky top-[86px]">
        <ClientOnly>
          <MainMap @change-coords="changeCoords" />
        </ClientOnly>
        <Transition name="fade" mode="out-in" class="space-y-5 mt-5">
          <CartEmpty v-if="cartProducts.length === 0" />
          <CartFilled v-else />
        </Transition>
      </div>
    </template>
    <CommonModalAddressDelivery
      v-model="show"
      :list="list"
      @close="show = false"
      @open-map-modal="openMapModal"
    />
    <CommonModalMap v-model="openModal" @close="openModal = false" />
  </LayoutWrapper>
</template>
<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'
import { useCategoriesStore } from '~/store/categories'
import type { IProduct } from '~/types/products.js'

const route = useRoute()

const categoriesStore = useCategoriesStore()
const show = ref(false)
const openModal = ref(false)

const categoriesLoading = computed(() => categoriesStore.categories.loading)
const categories = computed(() => categoriesStore.categories.list)
const single = computed(() => categoriesStore.single)

categoriesStore.fetchCategories()

const cartStore = useCartStore()

const cartProducts = computed(() => cartStore.products)

const { list } = useListFetcher<IProduct>(`/saved/address`, 25, false)

watch(
  () => route.name,
  () => {
    categoriesStore.single = null
  }
)

const changeCoords = () => {
  show.value = true
}

const openMapModal = () => {
  show.value = false
  openModal.value = true
}
</script>
