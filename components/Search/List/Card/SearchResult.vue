<template>
  <CommonSectionWrapper :title="item?.query">
    <Transition name="fade" mode="out-in">
      <div :key="item?.query" class="space-y-10">
        <div :key class="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-10">
          <MainCard
            v-for="(card, index) in item?.products"
            :key="index"
            :card
            @open="emit('select', card)"
          />
        </div>
        <Transition name="fade" mode="out-in">
          <BaseButton
            v-if="!hideMoreButton"
            class="text-sm w-full font-semibold py-2 px-12 group my-3 text-dark leading-tight"
            :text="$t('download_more')"
            size="sm"
            :loading
            :disabled="loading"
            variant="secondary"
            :class="{
              'md:!border-transparent': loading,
            }"
            @click="getProductsByQuery(item?.query)"
          >
            <template #prefix>
              <SvgoCommonChevron
                class="text-dark text-xl -rotate-90 transition-300 group-hover:text-orange"
              />
            </template>
          </BaseButton>
        </Transition>
      </div>
    </Transition>
  </CommonSectionWrapper>
</template>

<script setup lang="ts">
import { useListStore } from '~/store/list.js'
import { useSearchStore } from '~/store/search.js'

interface Props {
  item: any
}

defineProps<Props>()

const emit = defineEmits(['select'])

const listStore = useListStore()
const searchStore = useSearchStore()

const hideMoreButton = ref(false)

const loading = computed(() => searchStore.products.params.loading)
const getProductsByQuery = (query: string) => {
  searchStore.searchProducts(query, false).then((res: any) => {
    try {
      if (res?.items?.length) {
        listStore.searchByNoteProducts.list
          ?.find((ss) => ss?.query === query)
          ?.products?.push(...(res?.items || []))
      } else {
        hideMoreButton.value = true
      }
    } catch (error) {
      console.log('List Result load more error: ', error)
    }
  })
}
</script>

<style scoped></style>
