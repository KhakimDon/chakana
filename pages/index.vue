<template>
  <main>
    <LayoutWrapper v-if="useMobile('desktop')" has-fixed>
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
        <div
          class="fixed w-[313px] top-[86px] h-[calc(100vh-100px)] overflow-y-auto pb-16"
        >
          <ClientOnly>
            <MainMap @change-coords="changeCoords" />
          </ClientOnly>
          <Transition name="fade" mode="out-in" class="space-y-5 mt-5">
            <CartEmpty v-if="cartProducts.length === 0" />
            <CartFilled v-else />
          </Transition>
        </div>
      </template>
      <OrderInfoEditAddress v-model="show" @save="saveAddress" />
    </LayoutWrapper>
    <LayoutMobile v-else>
      <Transition name="fade" mode="out-in">
        <div :key="$route.name">
          <NuxtPage />
        </div>
      </Transition>
    </LayoutMobile>
  </main>
</template>
<script setup lang="ts">
import { required } from '@vuelidate/validators'

import { useCartStore } from '~/store/cart.js'
import { useCategoriesStore } from '~/store/categories'
import type { IProduct } from '~/types/products.js'

const route = useRoute()

const categoriesStore = useCategoriesStore()
const show = ref(false)

const categoriesLoading = computed(() => categoriesStore.categories.loading)
const categories = computed(() => categoriesStore.categories.list)
const single = computed(() => categoriesStore.single)

categoriesStore.fetchCategories()

const cartStore = useCartStore()

const cartProducts = computed(() => cartStore.products)

cartStore.getCartProducts()

watch(
  () => route.name,
  () => {
    categoriesStore.single = null
  }
)

const changeCoords = () => {
  show.value = true
}

function saveAddress(data: any) {
  console.log(data)
}
</script>
