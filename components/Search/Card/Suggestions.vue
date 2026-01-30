<template>
  <transition name="fade" mode="out-in">
    <div
      v-if="isShowSuggestions"
      class="absolute suggestions-shadow rounded-xl h-fit max-h-[300px] md:w-[calc(100%-80px)] md:left-8 w-full z-10 bg-white top-12"
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
</template>

<script setup lang="ts">
import { useSearchStore } from '~/store/search'

interface Props {
  search: string
}

const props = withDefaults(defineProps<Props>(), {
  search: '',
})

const router = useRouter()

const searchStore = useSearchStore()

const searchAutocompleteList = computed(
  () => searchStore.searchAutocompleteResults.list
)

const searchAutocompleteLoading = computed(
  () => searchStore.searchAutocompleteResults.loading
)

const isShowSuggestions = computed(() => {
  return (
    searchAutocompleteList.value.length &&
    props.search &&
    !searchStore.autoCompleteItemClicked
  )
})
const clickAutocompleteItem = (text: string) => {
  // Устанавливаем значение поиска, watch в родительском компоненте обработает сохранение
  router.push({ query: { query: text } })
  searchStore.autoCompleteItemClicked = true
}
</script>

<style scoped></style>
