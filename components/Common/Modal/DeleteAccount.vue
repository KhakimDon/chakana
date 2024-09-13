<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('delete_account')"
    body-class="!w-[424px]"
    @update:model-value="$emit('update:modelValue', false)"
  >
    <div>
      <template v-if="e?.locale?.value === 'ru'">
        <p class="text-sm leading-140 text-dark whitespace-pre-line">
          {{ $t('are_you_sure_to') }}
        </p>
        <p
          class="text-sm font-semibold leading-tight text-dark whitespace-pre-line"
        >
          {{ $t('your_account') }}
        </p>
      </template>
      <template v-else>
        <p
          class="text-sm font-semibold leading-tight text-dark whitespace-pre-line"
        >
          {{ $t('your_account') }}
        </p>
        <p class="text-sm leading-140 text-dark whitespace-pre-line">
          {{ $t('are_you_sure_to') }}
        </p>
      </template>
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
          :text="$t('delete')"
          size="md"
          :loading="loading"
          @click="$emit('doAction')"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  loading?: boolean
}
const e = useI18n()

defineProps<Props>()

defineEmits<{
  (e: 'doAction'): void
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style scoped></style>
