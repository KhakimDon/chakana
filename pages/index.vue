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
      <!--      <div :key="$route.name">-->
      <!--        <NuxtPage />-->
      <!--      </div>-->
    </Transition>
    <template #right>
      <div class="sticky top-[86px]">
        <MainMap />
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
  </LayoutWrapper>
</template>
<script setup lang="ts">
import { useCategoriesStore } from '~/store/categories'

const route = useRoute()

const categoriesStore = useCategoriesStore()

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
</script>
