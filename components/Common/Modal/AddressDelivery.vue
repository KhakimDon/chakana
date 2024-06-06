<template>
  <BaseModal
    v-bind="{ show }"
    body-class="!max-w-[424px]"
    :title="$t('address_delivery')"
    @close="$emit('close')"
  >
    <div></div>
  </BaseModal>
</template>

<script setup lang="ts">
interface Props {
  show?: boolean
}

defineProps<Props>()
</script>
