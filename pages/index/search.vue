<template>
  <div>
    <div class="w-full relative flex-y-center gap-2">
      <NuxtLinkLocale to="/" class="group">
        <IconChevron
          class="text-2xl text-dark group-hover:text-orange transition-300"
        />
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/search" class="w-full">
        <FormInputSearch
          v-model="search"
          input-id="main-search"
          :placeholder="$t('search')"
          class="w-full !h-10"
          @focus="focusInput"
        />
      </NuxtLinkLocale>
      <button
        class="w-10 h-10 rounded-lg bg-white-100 flex-center shrink-0 hover:bg-[#4DAAF81F] transition-300"
      >
        <IconList class="text-2xl text-blue-100" />
      </button>
      <transition name="fade" mode="out-in">
        <div
          v-if="
            searchAutocompleteList.length && search && !autoCompleteItemClicked
          "
          class="absolute left-8 suggestions-shadow rounded-xl h-fit max-h-[300px] z-10 bg-white top-12 w-[calc(100%-80px)]"
        >
          <div class="h-[60px] p-4 border-b border-white-100">
            <p class="text-dark text-base font-bold leading-7">
              {{ $t('suggestions_search') }}
            </p>
          </div>
          <transition name="fade" mode="out-in">
            <div
              v-if="searchAutocompleteLoading"
              class="px-4 space-y-2 overflow-x-hidden overflow-y-auto h-fit max-h-[240px] my-2"
            >
              <div
                v-for="key in 5"
                :key
                class="shimmer w-full h-9 rounded-10 p-4 pl-0 border-b border-white-100"
              />
            </div>
            <div
              v-else
              class="overflow-x-hidden overflow-y-auto h-fit max-h-[240px] pl-4"
            >
              <div
                v-for="(item, key) in searchAutocompleteList"
                :key
                class="p-4 pl-0 border-b border-white-100 cursor-pointer group"
                @click="clickAutocompleteItem(item?.name)"
              >
                <p
                  class="line-clamp-1 text-sm font-normal text-dark leading-130 group-hover:font-medium transition-300"
                >
                  {{ item?.name }}
                </p>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>

    <div class="flex-y-center gap-1.5 flex-wrap my-4">
      <SearchBadge title="Подгузники Huggies 5" />
    </div>

    <CommonSectionWrapper title="search_history" header-class="!mb-3">
      <template #action>
        <button
          class="text-sm text-orange font-medium leading-normal tracking-[0.15px] hover:underline"
        >
          {{ $t('clear') }}
        </button>
      </template>

      <div class="flex flex-col gap-2">
        <SearchHistory
          v-for="key in 3"
          :key
          title="Рис кругло зёрный Из Холодильника"
          @click="search = 'Рис кругло зёрный Из Холодильника'"
        />
      </div>
    </CommonSectionWrapper>
  </div>
</template>
<script setup lang="ts">
import debounce from 'lodash.debounce'

import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconList from '~/assets/icons/Common/list.svg'
import { useSearchStore } from '~/store/search'

const router = useRouter()
const search = ref('')
const searchStore = useSearchStore()

function focusInput() {
  const input = document.getElementById('main-search') as HTMLInputElement
  input.focus()
  autoCompleteItemClicked.value = false
}

onMounted(() => {
  focusInput()
})

const searchAutocompleteList = computed(
  () => searchStore.searchAutocompleteResults.list
)
const searchAutocompleteLoading = computed(
  () => searchStore.searchAutocompleteResults.loading
)

const updateSearch = debounce((val: string) => {
  searchStore.searchAutocomplete(val)
  searchStore.searchProducts(val)
}, 300)

watch(search, (val: string) => {
  if (val) {
    router.push({ query: { query: val } })
  } else {
    router.push({ query: {} })
  }
  updateSearch(val)
})

const autoCompleteItemClicked = ref(false)
const clickAutocompleteItem = (text: string) => {
  search.value = text
  autoCompleteItemClicked.value = true
}
</script>
<style scoped>
.suggestions-shadow {
  box-shadow: 0 6px 40px 0 #1c1c1c1a;
}
</style>
