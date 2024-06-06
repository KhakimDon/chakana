<template>
  <div>
    <div class="flex-y-center gap-2 justify-between">
      <div class="flex-y-center gap-2">
        <NuxtLinkLocale to="/search/list" class="group">
          <IconChevron
            class="text-2xl text-dark group-hover:text-orange transition-300"
          />
        </NuxtLinkLocale>
        <div>
          <p class="text-xl font-extrabold text-dark">
            {{ $t('from_your_request') }}
          </p>
          <p class="text-sm font-medium leading-130 text-gray-100">
            {{ t('found', { count: 0, all: results?.list?.length }) }}
          </p>
        </div>
      </div>
      <BaseButton
        class="text-sm w-fit font-semibold py-2 px-12 group my-3 text-dark leading-tight"
        :text="$t('checking_against_list')"
        size="sm"
        variant="secondary"
        @click="() => {}"
      >
        <template #prefix>
          <SvgoCommonToDo
            class="text-dark text-xl transition-300 group-hover:text-orange"
          />
        </template>
      </BaseButton>
    </div>
    <section class="w-full">
      <div v-if="results?.loading" class="flex-y-center flex-wrap gap-3 my-4">
        <div v-for="key in 7" :key class="w-44 h-52 shimmer rounded-10"></div>
      </div>
      <div
        v-else-if="results?.list?.length && !results?.loading"
        class="flex-y-center flex-wrap gap-4 my-4"
      >
        <div v-for="(item, key) in results?.list" :key>
          <CommonSectionWrapper :title="item?.query" class="mt-4">
            <Transition name="fade" mode="out-in">
              <div
                :key="results?.loading"
                class="grid grid-cols-5 gap-x-4 gap-y-10"
              >
                <template v-if="results?.loading">
                  <MainCardLoading v-for="key in 8" :key />
                </template>
                <template v-else-if="!results?.loading && results?.list.length">
                  <MainCard
                    v-for="(card, index) in item?.products"
                    :key="index"
                    :card
                    @click="selectProduct(card)"
                  />
                </template>
              </div>
            </Transition>
          </CommonSectionWrapper>
        </div>
      </div>
      <div v-else class="flex-center flex-col gap-3 mt-40">
        <CommonNoData
          class="w-full"
          image="/images/no-data/no-searches.png"
          :title="$t('search_list_no_data_title')"
          :subtitle="$t('search_list_no_data_subtitle')"
        />
      </div>
    </section>
    <MainModalInfo
      v-model="showProduct"
      :product="selectedProduct"
      @close="showProduct = false"
    />
  </div>
</template>

<script setup lang="ts">
import IconChevron from 'assets/icons/Common/chevron.svg'

import { useListStore } from '~/store/list.js'
import type { IProduct } from '~/types/products.js'

const { t } = useI18n()

const listStore = useListStore()

const results = computed(() => listStore.searchByNoteProducts)

onMounted(() => {
  listStore.getUserProductsByNotes(listStore.selectedList?.notes)
})

const showProduct = ref(false)
const selectedProduct = ref<IProduct | null>(null)

function selectProduct(product: IProduct) {
  selectedProduct.value = product
  showProduct.value = true
}
</script>

<style scoped></style>
