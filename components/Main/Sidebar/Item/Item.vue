<template>
  <div
    class="flex-y-center relative gap-3 p-1.5 rounded-[12px] cursor-pointer group transition-300"
    :class="[
      isSelected ? 'border border-orange' : 'border border-transparent',
      { 'grayscale pointer-events-none': item.is_active === false }
    ]"
    @click="selectCategory"
  >
    <div class="w-8 h-8 relative rounded-[6px] bg-[#F2F2F2] shrink-0">
      <nuxt-img
        v-if="item?.image || item?.icon || item?.icon_url"
        :src="item?.icon_url || item?.image || item?.icon || fallbackIcon"
        :alt="`image-${item?.name || item?.title}`"
        class="absolute object-contain transition-200"
        :class="[
          { grayscale: item.is_active === false },
          isFallback
            ? 'w-5 h-5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
            : 'w-full h-full left-0 bottom-0'
        ]"
        loading="lazy"
        @error="onImageError"
      />
    </div>
    <p
      class="text-sm sm:text-xs leading-130 font-semibold transition-300 flex-1 min-w-0"
      :class="isSelected ? 'text-dark' : 'text-[#7C8A94] md:group-hover:text-orange'"
    >
      {{ item?.name || item?.title }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ICategory } from '~/types/categories'
import { useCategoriesStore } from '~/store/categories'
import { useMainStore } from '~/store/main'

interface Props {
  item: ICategory
}

const props = defineProps<Props>()
const categoriesStore = useCategoriesStore()
const mainStore = useMainStore()

const fallbackIcon = '/images/svg/cart.svg'
const isFallback = ref(!(props.item?.image || props.item?.icon || props.item?.icon_url))

// Проверяем, выбрана ли эта категория
const isSelected = computed(() => {
  return categoriesStore.selectedCategoryId === props.item.id
})

// Выбор категории
const selectCategory = () => {
  categoriesStore.selectCategory(props.item.id)
  // Загружаем магазины с фильтром по категории
  mainStore.fetchNearbyStores(props.item.id)
}

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (!target || target.dataset.fallbackApplied) return
  target.src = fallbackIcon
  target.dataset.fallbackApplied = 'true'
  isFallback.value = true
}
</script>
