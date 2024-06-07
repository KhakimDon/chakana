<template>
  <LayoutWrapper>
    <Transition name="fade" mode="out-in">
      <div :key="$route.name">
        <div class="flex-y-center gap-1 cursor-pointer" @click="goBack">
          <SvgoCommonChevron class="text-base text-gray-100" />
          <p class="text-sm font-semibold text-gray-100">
            {{ $t('go_back') }}
          </p>
        </div>
        <div class="flex-y-center justify-between mt-3">
          <p class="text-[22px] font-extrabold leading-7">
            {{ $t('basket') }}
          </p>
          <div
            class="flex-center gap-2 group cursor-pointer select-none"
            @click="clearCart"
          >
            <SvgoCommonTrash
              class="text-base text-gray-100 group-hover:text-red transition-300"
            />
            <p
              class="text-xs font-semibold text-gray-100 group-hover:text-red transition-300"
            >
              {{ $t('clear_basket') }}
            </p>
          </div>
        </div>
        <div class="mt-6 max-h-96 overflow-y-auto">
          <SearchCardProduct
            v-for="(product, key) in cartProducts"
            :key
            :product="product"
            :class="{ 'bg-gray-300/50': key % 2 === 0 }"
          />
        </div>
        <section v-if="cartProducts.length === 0" class="my-5">
          <CommonNoData
            :title="$t('search_nodata_title')"
            :subtitle="$t('search_nodata_subtitle')"
            image="/images/no-data/no-searches.png"
          />
          <SearchSectionNewProducts />
        </section>
        <CommonSectionWrapper title="maybe_something_else" class="my-10">
          <Transition name="fade" mode="out-in">
            <div
              :key="products?.loading"
              class="grid grid-cols-5 gap-x-4 gap-y-10"
            >
              <template v-if="products?.loading">
                <MainCardLoading v-for="key in 16" :key />
              </template>
              <template v-else-if="!products?.loading && products?.list.length">
                <MainCard
                  v-for="(card, index) in products?.list"
                  :key="index"
                  :card
                  @open="selectProduct(card)"
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
        <MainModalInfo
          v-model="showProduct"
          :product="selectedProduct"
          @close="showProduct = false"
        />
      </div>
    </Transition>
    <template #right>
      <section class="space-y-5">
        <CartCardFreeDelivery
          :free-delivery-price="90000"
          :cart-total-price="totalCartProductsPrice"
        />
        <CartCardPriceInfo />
        <BaseButton
          class="w-full !rounded-10"
          :text="$t('go_to_registration')"
          variant="green"
          @click="goToPayment"
        />
      </section>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

import { useCartStore } from '~/store/cart.js'
import { useMainStore } from '~/store/main.js'
import type { IProduct } from '~/types/products.js'

const { locale } = useI18n()
const router = useRouter()
const cartStore = useCartStore()
const mainStore = useMainStore()

const showProduct = ref(false)
const selectedProduct = ref<IProduct | null>(null)

const cartProducts = computed(() => cartStore.products)
const products = computed(() => mainStore.products)

const goBack = () => {
  router.back()
}
const goToPayment = () => {
  router.push(`/${locale.value}/payment`)
}

// All prices
const totalCartProductsPrice = computed(() => {
  return (
    cartProducts.value.reduce((acc, product) => {
      return acc + product?.price * product?.cart_count
    }, 0) || 0
  )
})

// Fetch products
if (!products.value?.list.length) {
  mainStore.fetchProducts()
}

function selectProduct(product: IProduct) {
  selectedProduct.value = product
  showProduct.value = true
}

const target = ref<HTMLElement | null>(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    mainStore.fetchProducts(false)
  }
})

const clearCart = () => {
  cartStore.products = []
}
</script>

<style scoped></style>
