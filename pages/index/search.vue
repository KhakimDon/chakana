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
        <button
          class="w-10 h-10 rounded-lg bg-white-100 flex-center shrink-0 hover:bg-[#4DAAF81F] transition-300"
        >
          <IconList class="text-2xl text-blue-100" />
        </button>
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
        class="shimmer w-full h-16 rounded-10 pl-0 border-b border-white-100"
      />
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
  </div>
</template>
<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import debounce from 'lodash.debounce'

import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconList from '~/assets/icons/Common/list.svg'
import { useSearchStore } from '~/store/search'

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

const updateSearch = debounce((val: string) => {
  searchStore.searchAutocomplete(val)
  searchStore.searchProducts(val)
}, 300)

watch(search, (val: string) => {
  if (val) {
    router.push({ query: { query: val } })
    updateSearch(val)
  } else {
    router.push({ query: {} })
    searchStore.products.list = []
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
</script>
<style scoped>
.suggestions-shadow {
  box-shadow: 0 6px 40px 0 #1c1c1c1a;
}
</style>
