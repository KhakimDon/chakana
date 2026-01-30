<template>
  <div class="w-full h-[calc(100vh-126px)] gap-1 relative overflow-hidden">
    <div class="h-[calc(100vh-150px)] overflow-y-auto relative flex gap-2 w-[200%] overflow-x-hidden shrink-0">
      <Transition name="fade" mode="out-in">
        <div :key="loading" class="flex flex-col gap-1.5 transition-300 w-[50%]"
          :class="{ '-translate-x-full': isSingle }">
          <!-- Кнопка "Все" -->
          <div
            class="flex-y-center gap-3 p-1.5 rounded-[12px] cursor-pointer group transition-300"
            :class="selectedCategoryId === null ? 'border border-orange' : 'border border-transparent'"
            @click="selectAllCategories"
          >
            <div class="w-8 h-8 relative rounded-[6px] bg-[#F2F2F2] shrink-0 flex-center">
              <IconAllCategories class="w-4 h-4 text-[#ED2024]" />
            </div>
            <p 
              class="text-sm sm:text-xs leading-130 font-semibold transition-300 flex-1 min-w-0"
              :class="selectedCategoryId === null ? 'text-dark' : 'text-[#7C8A94] md:group-hover:text-orange'"
            >
              {{ $t('all') || 'Все' }}
            </p>
          </div>


          <template v-if="!loading">
            <MainSidebarItem v-for="(item, index) in categories" :key="index" v-bind="{ item }" />
          </template>
          <template v-else>
            <MainSidebarItemLoading v-for="index in 9" :key="index" />
          </template>
        </div>
      </Transition>
      <div :class="{ '-translate-x-full': isSingle }" class="flex flex-col gap-1.5 transition-300 w-[50%] shrink-0">
        <NuxtLinkLocale to="/" class="flex-y-center gap-2 group" aria-label="sidebar-single">
          <IconChevron class="text-2xl text-dark group-hover:-translate-x-1 transition-300" />
          <p class="text-base leading-normal font-extrabold text-dark">
            {{ single?.name || single?.title }}
          </p>
        </NuxtLinkLocale>

        <FormCheckboxNested v-if="single?.children?.length" v-model="checkbox" :list="single?.children"
          :parent-text="$t('all')" class="mt-5" />
      </div>
    </div>
    <div v-if="false" class="flex-center-between">
      <p class="text-sm leading-5 text-dark font-semibold whitespace-nowrap transition-300"
        :class="{ '-translate-x-5 -ml-10 opacity-0': hovered }">
        {{ $t('developed_by') }}
      </p>
      <CommonLogoUIC @mouseenter="hovered = true" @mouseleave="hovered = false" />
    </div>
  </div>
</template>
<script setup lang="ts">
import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconAllCategories from '~/assets/icons/Common/all-categories.svg'
import { useQuery } from '~/composables/useQuery'
import type { ICategory } from '~/types/categories'
import { useCategoriesStore } from '~/store/categories'
import { useMainStore } from '~/store/main'
import { useLocationsStore } from '~/store/locations'

interface Props {
  loading: boolean
  categories: ICategory[]
  single: ICategory
}

const props = defineProps<Props>()

const categoriesStore = useCategoriesStore()
const mainStore = useMainStore()
const locationsStore = useLocationsStore()

const { updateQuery } = useQuery()

const hovered = ref(false)

const route = useRoute()
const checkbox = ref([])

// Выбранная категория
const selectedCategoryId = computed(() => categoriesStore.selectedCategoryId)

// Выбрать "Все" категории
const selectAllCategories = () => {
  categoriesStore.clearCategorySelection()
  // Загружаем магазины только если есть активная локация
  if (locationsStore.getActiveLocation) {
    mainStore.fetchNearbyStores() // Загружаем все магазины
  }
}

const isSingle = computed(() => route.name.includes('index-category-slug'))

watch(
  () => isSingle.value,
  () => {
    checkbox.value = []
    setTimeout(() => {
      if (route.name.includes('index-category-slug')) {
        const categories = route.query.categories as string
        if (!categories) {
          checkbox.value = props.single?.children?.map(
            (category) => category.id
          )
        } else {
          checkbox.value = categories
            .split(',')
            .map((category) => Number(category))
        }
      }
    }, 600)
  },
  {
    immediate: true,
  }
)

watch(
  () => checkbox.value?.length,
  () => {
    if (checkbox.value?.length === props.single?.children?.length) {
      updateQuery('categories', undefined)
    } else {
      updateQuery('categories', checkbox.value.join(','))
    }
  }
)

if (route.name.includes('index-category-slug')) {
  const categories = route.query.categories as string
  if (!categories) {
    checkbox.value = props.single?.children?.map((category) => category.id)
  } else {
    checkbox.value = categories.split(',').map((category) => Number(category))
  }
}
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 200ms;
}

.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-enter-to,
.slide-left-leave,
.slide-right-enter-to,
.slide-right-leave {
  transform: translateX(0);
}
</style>
