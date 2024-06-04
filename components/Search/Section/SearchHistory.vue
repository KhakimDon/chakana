<template>
  <transition name="fade" mode="out-in">
    <CommonSectionWrapper
      v-if="searchHistoryList.length"
      title="search_history"
      header-class="!mb-3"
    >
      <template #action>
        <button
          class="text-sm text-orange font-medium leading-normal tracking-[0.15px] hover:underline"
          @click="clearSearchHistory"
        >
          {{ $t('clear') }}
        </button>
      </template>

      <div class="flex flex-col gap-2">
        <div v-if="searchHistoryLoading">
          <div
            v-for="key in 5"
            :key
            class="shimmer w-full h-9 rounded-10 p-4 pl-0 border-b border-white-100"
          />
        </div>
        <SearchHistory
          v-for="(item, key) in searchHistoryList"
          :key
          :title="item"
          @click="emit('clickHistory', item)"
        />
      </div>
    </CommonSectionWrapper>
  </transition>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/store/search'

const emit = defineEmits(['clickHistory'])

const searchStore = useSearchStore()

const searchHistoryList = computed(() => searchStore.searchHistoryResults.list)
const searchHistoryLoading = computed(
  () => searchStore.searchHistoryResults.loading
)

const clearSearchHistory = () => {
  searchStore.clearSearchHistory().then(() => {
    searchStore.searchHistoryResults.loading = false
    searchStore.searchHistoryResults.list = []
  })
}

onMounted(() => {
  searchStore.searchHistory()
})
</script>

<style scoped></style>
