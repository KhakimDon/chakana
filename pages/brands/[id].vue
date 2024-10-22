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
      <section class="container space-y-6 max-sm:mt-16">
        <CommonSectionWrapper :title="single?.title" title-link>
          <template #beforeTitle>
            <NuxtLinkLocale to="/brands">
              <IconChevron
                class="text-2xl text-dark group-hover:-translate-x-1 transition-300 group-hover:text-orange"
              />
            </NuxtLinkLocale>
          </template>

          <Transition mode="out-in" name="fade">
            <div
              :key="loading?.list"
              class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10"
            >
              <template v-if="loading?.list">
                <MainCardLoading v-for="key in 16" :key />
              </template>
              <template v-else-if="list?.length">
                <MainCard v-for="(card, index) in list" :key="index" :card />
              </template>
              <template v-else>
                <CommonNoData class="col-span-4" />
              </template>
            </div>
          </Transition>
          <div
            v-if="!loading?.list && !loading?.button && paginationData?.next"
            ref="infiniteScrollTrigger"
          />
          <MainModalInfo
            v-model="showProduct"
            :product="selectedProduct"
            @close="showProduct = false"
          />
        </CommonSectionWrapper>
      </section>

      <template #right>
        <div class="sticky bottom-0 w-[313px] overflow-y-auto pb-16">
          <ClientOnly>
            <MainMapSidebar class="md:mr-2" @change-coords="changeCoords" />
          </ClientOnly>
          <Transition class="space-y-5 mt-5 md:mr-2" mode="out-in" name="fade">
            <CartEmpty v-if="cartProducts.length === 0" />
            <CartFilled v-else />
          </Transition>
        </div>
      </template>
    </LayoutWrapper>
    <LayoutMobile v-else>
      <section class="container my-24 space-y-6">
        <CommonSectionWrapper :title="single?.title" class="my-6" title-link>
          <template #beforeTitle>
            <NuxtLinkLocale to="/brands">
              <IconChevron
                class="text-2xl text-dark group-hover:-translate-x-1 transition-300 group-hover:text-orange"
              />
            </NuxtLinkLocale>
          </template>

          <Transition mode="out-in" name="fade">
            <div
              :key="loading?.list"
              class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10"
            >
              <template v-if="loading?.list">
                <MainCardLoading v-for="key in 16" :key />
              </template>
              <template v-else-if="list?.length">
                <MainCard v-for="(card, index) in list" :key="index" :card />
              </template>
              <template v-else>
                <CommonNoData class="col-span-4" />
              </template>
            </div>
          </Transition>
          <div
            v-if="!loading?.list && !loading?.button && paginationData?.next"
            ref="infiniteScrollTrigger"
          />
        </CommonSectionWrapper>
      </section>
    </LayoutMobile>
  </main>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import IconChevron from 'assets/icons/Common/chevron.svg'

import { useCartStore } from '~/store/cart.js'
import { useCategoriesStore } from '~/store/categories'
import type { IProduct } from '~/types/products.js'

const route = useRoute()

const categoriesStore = useCategoriesStore()
const show = ref(false)

const categoriesLoading = computed(() => categoriesStore.categories.loading)
const categories = computed(() => categoriesStore.categories.list)

categoriesStore.fetchCategories()

const cartStore = useCartStore()

const cartProducts = computed(() => cartStore.products)

onMounted(() => {
  cartStore.getCartProducts()
})

watch(
  () => route.name,
  () => {
    categoriesStore.single = null
  }
)

const { data: single } = await useAsyncData<IProduct>('brands-single', () =>
  useApi().$get(`/brand/${route.params.id}`)
)
const { list, loading, loadMore, paginationData } = useListFetcher<IProduct>(
  `/brand/products/pagination/${route.params.id}`,
  25,
  true
)

const showProduct = ref(false)
const selectedProduct = ref<IProduct | null>(null)
const infiniteScrollTrigger = ref<HTMLElement | null>(null)

useIntersectionObserver(infiniteScrollTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting && !loading.list) {
    loadMore()
  }
})

const changeCoords = () => {
  show.value = true
}

useSeoMeta({
  title: single.value.title,
  description: single.value.title,
  ogTitle: single.value.title,
  twitterTitle: `Xolodilnik`,
  twitterCard: 'summary',
  twitterSite: '@xolodilnik',
  ogImage: single.value.image,
  twitterImage: '/og.png',
})
</script>
