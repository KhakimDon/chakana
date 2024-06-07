<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('delete_card')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <i18n-t
      keypath="are_you_sure_to_delete_this_card"
      tag="p"
      class="text-sm leading-140 text-dark whitespace-pre-line"
    >
      <template #card>
        <span class="font-semibold">
          {{ activeCard?.card_number }}
        </span>
      </template>
    </i18n-t>
    <div class="grid grid-cols-2 gap-4 mt-6">
      <BaseButton
        class="!py-3 !rounded-[10px]"
        :text="$t('cancel')"
        size="md"
        variant="secondary"
        @click="$emit('update:modelValue', false)"
      />
      <BaseButton
        class="!py-3 !rounded-[10px]"
        :loading="deleteLoading"
        :text="$t('delete')"
        size="md"
        @click="$emit('delete')"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { IBankCard } from '~/types/profile.js'

interface Props {
  modelValue: boolean
  activeCard: IBankCard | null
  deleteLoading: boolean
}
defineProps<Props>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'delete'): void
}>()
</script>
