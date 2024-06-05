<template>
  <div>
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

    <section v-if="!products.list?.length">
      <SearchSectionPopularSearch />
      <SearchSectionSearchHistory />
    </section>
    <section v-else class="my-9">
      <div
        v-for="(product, key) in products.list"
        :key
        class="flex-y-center gap-2 justify-between rounded-xl px-4 py-3"
      >
        <div class="flex-y-center gap-2">
          <div
            class="border bg-white border-white-100 w-16 relative h-[52px] rounded-10 px-0.5"
          >
            <NuxtImg
              :src="product.main_image"
              class="w-full h-fit absolute -bottom-1 object-cover object-center"
            />
          </div>
          <div class="space-y-0.5">
            <p class="text-[13px] font-semibold leading-none text-dark">
              {{ product?.name }}
            </p>
            <p class="text-xs font-medium leading-130 text-gray-400">
              {{ product?.weight }} {{ product?.weight_measure }}
            </p>
          </div>
        </div>
        <div class="w-24">
          <BaseButton
            v-if="count < 1"
            class="w-24"
            :text="$t('to_basket')"
            variant="outline"
            @click="count++"
          />
          <MainCardCounter
            v-else
            v-model="count"
            :default-count="count"
            class="w-24 border-none bg-white-100"
            readonly
          />
        </div>
      </div>
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
const count = ref(0)
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
