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
        @click="openAddListModal"
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
        class="flex-y-center flex-wrap gap-4 my-4"
      >
        <SearchListCard
          v-for="(list, key) in lists?.list"
          :key
          :list="list"
          @open-details="openDetailsModal(list)"
          @delete="deleteList"
        />
      </div>
      <div v-else class="flex-center flex-col gap-3 mt-40">
        <CommonNoData
          class="w-full"
          image="/images/no-data/no-searches.png"
          :title="$t('search_list_no_data_title')"
          :subtitle="$t('search_list_no_data_subtitle')"
        />
        <BaseButton
          class="w-fit py-2 px-7"
          :text="$t('new_list')"
          @click="openAddListModal"
        >
          <template #prefix>
            <SvgoCommonPlus class="text-white text-xl" />
          </template>
        </BaseButton>
      </div>
    </section>
    <ModalListAdd v-model="addListModal" :selected-list="selectedList" />
  </main>
</template>

<script setup lang="ts">
import IconChevron from 'assets/icons/Common/chevron.svg'

import { useListStore } from '~/store/list.js'

const addListModal = ref(false)
const listStore = useListStore()

const lists = computed(() => listStore.lists)

const params = {
  limit: 20,
  offset: 0,
}

listStore.getUserProductsList(params)

const selectedList = computed(() => listStore.selectedList)
const openDetailsModal = (list: any) => {
  listStore.selectedList = list
  addListModal.value = true
}

const openAddListModal = () => {
  listStore.selectedList = null
  addListModal.value = true
}

const deleteList = (id: string) => {
  listStore.deleteList(id).then(() => {
    listStore.getUserProductsList(params)
  })
}
</script>

<style scoped></style>
