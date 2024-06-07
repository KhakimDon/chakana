<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('checking_against_list')"
    title-class="!text-xl !font-extrabold !leading-7"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="space-y-4 max-h-96 overflow-y-auto pr-3">
      <div
        v-for="(item, key) in results?.list"
        :key
        class="flex-y-center gap-2 justify-between"
      >
        <p class="text-xl font-extrabold text-dark leading-7">
          {{ item?.query }}
        </p>
        <div class="flex-y-center gap-2">
          <SvgoCommonCheck
            v-if="singleList?.notes?.includes(item?.query)"
            class="text-green text-xl"
          />
          <SvgoCommonClose v-else class="text-red text-xl" />
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
