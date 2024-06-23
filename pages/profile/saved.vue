<template>
  <main>
    <CommonBack v-if="useMobile('mobile')" to="/profile" />
    <div class="flex-center-between mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('saved_list') }}
      </h1>
      <button
        class="flex-y-center gap-1 text-red text-sm font-semibold leading-5 transition-300 group hover:text-orange"
        @click="openAddListModal"
      >
        <SvgoCommonPlus
          class="text-xl leading-5 text-red transition-300 group-hover:text-orange"
        />
        <span class="hidden md:inline">{{ $t('new_list') }}</span>
      </button>
    </div>
    <section class="w-full">
      <div v-if="lists?.loading" class="flex-y-center flex-wrap gap-3 my-4">
        <div
          v-for="key in 7"
          :key
          class="w-full md:w-44 h-52 shimmer rounded-10"
        ></div>
      </div>
      <div
        v-else-if="lists?.list?.length && !lists?.loading"
        class="flex-y-center flex-wrap gap-4 my-4"
      >
        <SearchListCard
          v-for="(list, key) in lists?.list"
          :key
          :list="list"
          show-delete
          @open-details="openDetailsModal(list)"
          @delete="deleteList"
        />
      </div>
      <div v-else class="flex-center flex-col gap-3 md:mt-40">
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
    <PaymentModalListAdd
      v-model="addListModal"
      has-save
      :selected-list="selectedList"
    />
  </main>
</template>

<script setup lang="ts">
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
