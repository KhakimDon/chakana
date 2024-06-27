<template>
  <div
    class="bg-white h-[calc(100vh-68px)] top-[68px] left-0 z-10 fixed w-full p-4"
  >
    <div class="flex flex-col gap-1.5 transition-300 shrink-0">
      <button
        class="flex-y-center gap-1 group"
        aria-label="sidebar-single"
        @click="$emit('close')"
      >
        <IconChevron class="text-xl text-gray-100" />
        <p class="text-sm !leading-normal text-gray-100 font-bold">
          {{ $t('back') }}
        </p>
      </button>

      <p class="text-base leading-normal font-extrabold text-dark mt-3">
        {{ $t('filter') }}
      </p>
      <FormCheckboxNested
        v-if="single?.children?.length"
        v-model="checkbox"
        :list="single?.children"
        parent-text="All"
        class="mt-3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconChevron from '~/assets/icons/Common/chevron.svg'
import { useQuery } from '~/composables/useQuery'
import { useCategoriesStore } from '~/store/categories.js'

const route = useRoute()
const checkbox = ref([])
const { updateQuery } = useQuery()

const categoriesStore = useCategoriesStore()
defineEmits(['close'])

const single = computed(() => categoriesStore.single)

watch(
  () => checkbox.value?.length,
  () => {
    if (checkbox.value?.length === single.value?.children?.length) {
      updateQuery('categories', undefined)
    } else {
      updateQuery('categories', checkbox.value.join(','))
    }
  }
)

if (route.name.includes('index-category-slug')) {
  const categories = route.query.categories as string
  if (!categories) {
    checkbox.value = single.value?.children?.map((category) => category.id)
  } else {
    checkbox.value = categories.split(',').map((category) => Number(category))
  }
}
</script>

<style scoped></style>
