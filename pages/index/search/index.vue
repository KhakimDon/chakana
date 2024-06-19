<template>
  <div>
    <section class="sticky bg-white py-5 w-full z-10 top-0 xl:top-[69px]">
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

    <section v-if="!search" class="mb-[85px] md:mb-0">
      <SearchSectionPopularSearch />
      <SearchSectionSearchHistory />
    </section>
    <SearchCardLoading v-if="products.loading && search" :count="10" />
    <section
      v-else-if="products.list?.length && search && !products.loading"
      class="my-5 mb-0 md:mb-[85px]"
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
      <SearchCardLoading :count="5" />
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
