<template>
  <transition name="fade" mode="out-in">
    <div v-if="popularSearchLoading" class="flex-y-center gap-2 flex-wrap my-4">
      <div
        v-for="key in 6"
        :key
        class="shimmer h-9 rounded-full p-4 pl-0 border-b border-white-100"
        :class="key % 3 === 0 ? 'w-20' : 'w-32'"
      />
    </div>
    <div v-else class="flex-y-center gap-1.5 flex-wrap my-4">
      <SearchBadge
        v-for="(item, key) in popularSearchList"
        :key
        :title="item"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/store/search'

const searchStore = useSearchStore()

const popularSearchList = computed(() => searchStore.popularSearchResults.list)

const popularSearchLoading = computed(
  () => searchStore.popularSearchResults.loading
)

onMounted(() => {
  searchStore.searchPopular()
})
</script>

<style scoped></style>
