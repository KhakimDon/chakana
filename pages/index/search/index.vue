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
          @keydown.enter="outsideClicked = true"
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

    <section
      v-if="!search"
      class="mb-[85px] md:mb-0"
      @click="outsideClicked = true"
    >
      <SearchSectionPopularSearch />
      <SearchSectionSearchHistory />
    </section>
    <SearchCardLoading v-if="products.loading && search" :count="6" />
    <section
      v-else-if="products.list?.length && search && !products.loading"
      class="my-5"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        <MainCardStoreCard
          v-for="store in products.list"
          :key="store.id"
          :store="store"
        />
      </div>
    </section>
    <section
      v-else-if="!products.list?.length && search && !products.loading"
      class="my-5"
    >
      <CommonNoData
        :title="$t('search_nodata_title')"
        :subtitle="$t('search_nodata_subtitle')"
        image="/images/no-data/nf.svg"
      />
      <SearchSectionNewProducts />
    </section>
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
  if (val && val.trim()) {
    outsideClicked.value = false
    router.push({ query: { query: val } }).then(() => {
      updateSearch(val)
      // Сохраняем поисковый запрос в историю после выполнения поиска
      searchStore.saveSearch(val.trim())
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
    if (val.query && val.query !== search.value) {
      search.value = val.query
      // Выполняем поиск при изменении query параметра
      if (val.query.trim()) {
        updateSearch(val.query)
        searchStore.saveSearch(val.query.trim())
      }
    }
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  if (route.query.query) {
    outsideClicked.value = true
    // Выполняем поиск при загрузке страницы с query параметром
    const query = String(route.query.query)
    if (query.trim()) {
      updateSearch(query)
      searchStore.saveSearch(query.trim())
    }
  }
})

// Убрано: пагинация для магазинов не поддерживается через offset
// const target = ref<HTMLElement | null>(null)
// useIntersectionObserver(target, ([{ isIntersecting }]) => {
//   if (isIntersecting) {
//     if (products.value.next) {
//       searchStore.searchProducts(String(search.value), false)
//     }
//   }
// })
</script>
<style scoped>
.suggestions-shadow {
  box-shadow: 0 6px 40px 0 #1c1c1c1a;
}
</style>
