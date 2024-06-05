<template>
  <main>
    <div class="flex-y-center gap-2 justify-between">
      <div class="flex-y-center gap-2">
        <NuxtLinkLocale to="/search" class="group">
          <IconChevron
            class="text-2xl text-dark group-hover:text-orange transition-300"
          />
        </NuxtLinkLocale>
        <p class="text-xl font-extrabold text-dark">{{ $t('search_list') }}</p>
      </div>
      <div
        v-if="lists?.list?.length"
        class="flex-y-center gap-1 cursor-pointer select-none"
      >
        <SvgoCommonPlus class="text-red text-sm" />
        <p class="text-sm font-semibold leading-tight text-red">
          {{ $t('new_list') }}
        </p>
      </div>
    </div>
    <section class="w-full">
      <div v-if="lists?.loading" class="flex-y-center flex-wrap gap-3 my-4">
        <div v-for="key in 7" :key class="w-44 h-52 shimmer rounded-10"></div>
      </div>
      <div
        v-else-if="lists?.list?.length && !lists?.loading"
        class="flex-y-center gap-3 my-4"
      >
        <SearchListCard
          v-for="list in lists?.list"
          :key="list.id"
          :list="list"
        />
      </div>
      <div v-else class="flex-center flex-col gap-3 mt-40">
        <CommonNoData
          class="w-full"
          image="/images/no-data/no-searches.png"
          :title="$t('search_list_no_data_title')"
          :subtitle="$t('search_list_no_data_subtitle')"
        />
        <BaseButton class="w-fit py-2 px-7" :text="$t('new_list')">
          <template #prefix>
            <SvgoCommonPlus class="text-white text-xl" />
          </template>
        </BaseButton>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import IconChevron from 'assets/icons/Common/chevron.svg'

import { useListStore } from '~/store/list.js'

const listStore = useListStore()

const lists = computed(() => listStore.lists)

const params = {
  limit: 20,
  offset: 0,
}

listStore.getUserProductsList(params)
</script>

<style scoped></style>
