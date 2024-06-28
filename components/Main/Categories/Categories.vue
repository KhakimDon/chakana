<template>
  <div class="my-5">
    <Transition name="fade" mode="out-in">
      <div
        :key="categoriesLoading"
        class="grid grid-cols-2 gap-3 transition-300"
      >
        <template v-if="!categoriesLoading">
          <MainSidebarItem
            v-for="(item, index) in categories?.slice(0, 8)"
            :key="index"
            v-bind="{ item }"
            class="last:before:!block"
          />

          <NuxtLinkLocale to="/categories" class="block col-span-2 mt-1">
            <BaseButton
              v-if="categories?.length > 8"
              class="w-full"
              variant="secondary"
              :text="$t('all_categories')"
            />
          </NuxtLinkLocale>
        </template>
        <template v-else>
          <MainSidebarItemLoading v-for="index in 9" :key="index" />
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/store/categories.js'

const categoriesStore = useCategoriesStore()

const categoriesLoading = computed(() => categoriesStore.categories.loading)
const categories = computed(() => categoriesStore.categories.list)
</script>
