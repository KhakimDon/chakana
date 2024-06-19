<template>
  <div>
    <NuxtLinkLocale
      to="/"
      class="flex items-center gap-1 text-gray-100 cursor-pointer group"
    >
      <IconChevron
        class="cursor-pointer text-gray-100 group-hover:-translate-x-1 transition-300 group-hover:text-orange"
      />
      <p class="text-gray-100 group-hover:text-orange transition-300">
        {{ $t('back') }}
      </p>
    </NuxtLinkLocale>
    <h1 class="text-xl leading-normal font-bold my-3">
      {{ $t('all_categories') }}
    </h1>

    <Transition name="fade" mode="out-in">
      <div :key="categoriesLoading" class="grid gap-1.5 transition-300">
        <template v-if="!categoriesLoading">
          <MainSidebarItem
            v-for="(item, index) in categories"
            :key="index"
            v-bind="{ item }"
          />
        </template>
        <template v-else>
          <MainSidebarItemLoading v-for="index in 9" :key="index" />
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import IconChevron from '~/assets/icons/Common/chevron.svg'
import { useCategoriesStore } from '~/store/categories.js'

const categoriesStore = useCategoriesStore()

const categoriesLoading = computed(() => categoriesStore.categories.loading)
const categories = computed(() => categoriesStore.categories.list)
</script>
