<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('checking_against_list')"
    title-class="!text-xl !font-extrabold !leading-7"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div>
      <div v-if="results.loading" class="space-y-2 divide-y divide-white-100">
        <div
          v-for="key in 5"
          :key
          class="flex items-center justify-between w-full pt-2"
        >
          <div class="w-1/2 h-5 rounded-10 shimmer"></div>
          <div class="size-5 rounded-full shimmer"></div>
        </div>
      </div>
      <div
        v-else-if="results.list?.length && !results.loading"
        class="space-y-4 max-h-96 overflow-y-auto pr-3"
      >
        <div
          v-for="(item, key) in results?.list"
          :key
          class="flex items-start gap-2 justify-between"
        >
          <div>
            <p class="text-xl font-extrabold text-dark leading-7">
              {{ item?.query }}
            </p>
            <!--            <ul v-for="product in 4" :key="product" class="list-disc">-->
            <!--              <li class="text-sm font-semibold leading-130">-->
            <!--                <pre>{{ product }}</pre>-->
            <!--              </li>-->
            <!--            </ul>-->
          </div>
          <div class="flex-y-center gap-2">
            <SvgoCommonCheck
              v-if="item?.query?.products?.length"
              class="text-green text-xl"
            />
            <SvgoCommonClose v-else class="text-red text-xl" />
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useListStore } from '~/store/list.js'

interface Props {
  modelValue: boolean
  singleList: any
}
defineProps<Props>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const listStore = useListStore()

const results = computed(() => listStore.searchByNoteAndOrderProducts)
</script>
