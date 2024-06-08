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
      <div class="fixed w-[313px] top-[86px]">
        <ClientOnly>
          <MainMap />
        </ClientOnly>
        <Transition name="fade" mode="out-in" class="space-y-5 mt-5">
          <CartEmpty v-if="cartProducts.length === 0" />
          <CartFilled v-else />
        </Transition>
      </div>
    </template>
  </LayoutWrapper>
</template>
<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'
import { useCategoriesStore } from '~/store/categories'

const route = useRoute()

const categoriesStore = useCategoriesStore()

const categoriesLoading = computed(() => categoriesStore.categories.loading)
const categories = computed(() => categoriesStore.categories.list)
const single = computed(() => categoriesStore.single)

categoriesStore.fetchCategories()

const cartStore = useCartStore()

const cartProducts = computed(() => cartStore.products)

watch(
  () => route.name,
  () => {
    categoriesStore.single = null
  }
)
</script>
