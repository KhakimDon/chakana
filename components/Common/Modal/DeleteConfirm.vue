<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('clear_cart')"
    @update:model-value="$emit('update:modelValue', false)"
  >
    <div>
      <p class="text-sm leading-140 text-dark whitespace-pre-line">
        {{ $t('are_you_sure_to_clear_cart') }}
      </p>
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
          :text="$t('confirm')"
          size="md"
          @click="$emit('doAction')"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
}

defineProps<Props>()

defineEmits<{
  (e: 'doAction'): void
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style scoped></style>
