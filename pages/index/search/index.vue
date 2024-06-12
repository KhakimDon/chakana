<template>
  <div>
    <section class="sticky bg-white py-5 top-[69px] w-full z-10">
      <div ref="suggestionsRef" class="w-full relative flex-y-center gap-2">
        <NuxtLinkLocale to="/" class="group">
          <IconChevron
            class="text-2xl text-dark group-hover:text-orange transition-300"
          />
        </NuxtLinkLocale>
        <FormInputSearch
          v-model="search"
          input-id="main-search"
          :placeholder="$t('search')"
          class="w-full !h-10"
          @focus="focusInput"
          @clear="search = ''"
        />
        <NuxtLinkLocale
          to="/search/list"
          class="w-10 h-10 rounded-lg bg-white-100 flex-center shrink-0 hover:bg-[#4DAAF81F] transition-300"
        >
          <IconList class="text-2xl text-blue-100" />
        </NuxtLinkLocale>
        <SearchCardSuggestions v-if="!outsideClicked" :search="search" />
      </div>
    </section>

    <section v-if="!search">
      <SearchSectionPopularSearch />
      <SearchSectionSearchHistory />
    </section>
    <section v-if="products.loading && search" class="my-5 space-y-3">
      <div
        v-for="key in 10"
        :key
        class="w-full flex gap-2 items-center rounded-10 p-2 border border-white-100 bg-white"
      >
        <div
          class="border bg-white shrink-0 border-white-100 w-16 relative h-[52px] rounded-10 px-0.5 shimmer"
        />
        <div class="flex items-center justify-between w-full gap-3">
          <div class="space-y-1 w-full">
            <div class="h-7 w-3/4 shimmer rounded-10"></div>
            <div class="h-5 w-10 shimmer rounded-10"></div>
          </div>
          <div class="h-10 w-24 shimmer rounded-10"></div>
        </div>
      </div>
    </section>
    <section
      v-else-if="products.list?.length && search && !products.loading"
      class="my-5"
    >
      <SearchCardProduct
        v-for="(product, key) in products.list"
        :key
        :product="product"
        :class="{ 'bg-gray-300/50': key % 2 === 0 }"
      />
      <div
        v-if="
          products.params?.total > products?.list.length &&
          !products?.loading &&
          !products?.params?.loading
        "
        ref="target"
      />
    </section>
    <section
      v-else-if="!products.list?.length && search && !products.loading"
      class="my-5"
    >
      <CommonNoData
        :title="$t('search_nodata_title')"
        :subtitle="$t('search_nodata_subtitle')"
        image="/images/no-data/no-searches.png"
      />
      <SearchSectionNewProducts />
    </section>
    <template v-if="products?.params?.loading">
      <div class="my-5 space-y-3">
        <div
          v-for="key in 5"
          :key
          class="w-full flex gap-2 items-center rounded-10 p-2 border border-white-100 bg-white"
        >
          <div
            class="border bg-white shrink-0 border-white-100 w-16 relative h-[52px] rounded-10 px-0.5 shimmer"
          />
          <div class="flex items-center justify-between w-full gap-3">
            <div class="space-y-1 w-full">
              <div class="h-7 w-3/4 shimmer rounded-10"></div>
              <div class="h-5 w-10 shimmer rounded-10"></div>
            </div>
            <div class="h-10 w-24 shimmer rounded-10"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { onClickOutside, useIntersectionObserver } from '@vueuse/core'

import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconList from '~/assets/icons/Common/list.svg'
import { useSearchStore } from '~/store/search'
import { debounce } from '~/utils/functions/common.js'

const router = useRouter()
const route = useRoute()
const search = ref('')
const searchStore = useSearchStore()

function focusInput() {
  const input = document.getElementById('main-search') as HTMLInputElement
  input.focus()
  searchStore.autoCompleteItemClicked = false
  outsideClicked.value = false
}

onMounted(() => {
  focusInput()
})

const products = computed(() => searchStore.products)

const suggestionsRef = ref<HTMLDivElement | null>(null)
const outsideClicked = ref(false)

onClickOutside(suggestionsRef, () => {
  outsideClicked.value = true
})

const updateSearch = (val: string) => {
  return debounce(
    'search',
    () => {
      searchStore.searchAutocomplete(val)
      searchStore.searchProducts(val)
    },
    300
  )
}

watch(search, (val: string) => {
  if (val) {
    outsideClicked.value = false
    router.push({ query: { query: val } }).then(() => {
      updateSearch(val)
    })
  } else {
    router.push({ query: {} })
    searchStore.products.list = []
    searchStore.products.loading = false
  }
})

watch(
  () => route.query,
  (val: any) => {
    if (val.query) {
      search.value = val.query
    }
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  if (route.query.query) {
    outsideClicked.value = true
  }
})

const target = ref<HTMLElement | null>(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    searchStore.searchProducts(String(search.value), false)
  }
})
</script>
<style scoped>
.suggestions-shadow {
  box-shadow: 0 6px 40px 0 #1c1c1c1a;
}
</style>
