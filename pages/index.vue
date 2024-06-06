<template>
  <LayoutWrapper>
    <template #left>
      <MainSidebar
        class="sticky top-[86px]"
        :loading="categoriesLoading"
        v-bind="{ categories, single }"
      />
    </template>
    <Transition name="fade" mode="out-in">
      <div :key="$route.name">
        <NuxtPage />
      </div>
    </Transition>
    <template #right>
      <div class="sticky top-[86px]">
        <MainMap @change-coords="changeCoords" />
        <div v-if="false" class="mt-5">
          <p class="text-xl leading-normal font-extrabold text-dark">
            {{ $t('basket') }}
          </p>
          <CommonNoData
            image="/images/no-data/no-basket.webp"
            title="empty_basket"
            subtitle="empty_basket_text"
            title-class="!max-w-full"
            subtitle-class="!max-w-full"
          />
        </div>
      </div>
    </template>
    <Teleport to="body">
      <CommonModalAddressDelivery v-model="show" @close="show = false" />
    </Teleport>
  </LayoutWrapper>
</template>
<script setup lang="ts">
import { useCategoriesStore } from '~/store/categories'

const route = useRoute()

const categoriesStore = useCategoriesStore()
const show = ref(true)

const categoriesLoading = computed(() => categoriesStore.categories.loading)
const categories = computed(() => categoriesStore.categories.list)
const single = computed(() => categoriesStore.single)

categoriesStore.fetchCategories()

watch(
  () => route.name,
  () => {
    categoriesStore.single = null
  }
)

const changeCoords = () => {
  show.value = true
}
</script>
