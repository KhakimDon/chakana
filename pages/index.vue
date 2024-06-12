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
      <div
        class="fixed w-[313px] top-[86px] h-[calc(100vh-100px)] overflow-y-auto"
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
    <CommonModalAddressDelivery
      v-model="show"
      :list="list"
      :button-loading="buttonLoading"
      @close="show = false"
      @open-map-modal="openMapModal"
      @handle-address="handleAddress"
    />
    <CommonModalMap
      v-model="openModal"
      @close="openModal = false"
      @open-saved-adress="openSavedAddress"
    />
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
const { handleError } = useErrorHandling()
const buttonLoading = ref(false)

const categoriesLoading = computed(() => categoriesStore.categories.loading)
const categories = computed(() => categoriesStore.categories.list)
const single = computed(() => categoriesStore.single)

categoriesStore.fetchCategories()

const cartStore = useCartStore()

const cartProducts = computed(() => cartStore.products)

cartStore.getCartProducts()

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

const handleAddress = (item: object) => {
  buttonLoading.value = true
  useApi()
    .$get(`/saved/address/${item.id}`)
    .then((res: any) => {
      if (res) {
        useApi().$post(`/saved/address`, {
          body: {
            icon_id: res.icon_id,
            title: res.title,
            street: res.street,
            zip: res.zip,
            latitude: res.latitude,
            longitude: res.longitude,
          },
        })
      }
    })
    .catch((err: any) => {
      handleError(err)
    })
    .finally(() => {
      buttonLoading.value = false
    })
}

const openSavedAddress = () => {
  show.value = true
  openModal.value = false
}
</script>
