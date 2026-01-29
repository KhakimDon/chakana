<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="flex items-baseline gap-2"
    >
      <p class="text-sm text-gray-100 leading-relaxed shrink-0">{{ item?.key }}</p>
      <div class="flex-1 border-b border-dashed border-gray-200 relative top-[-4px]" />
      <p class="text-sm text-dark leading-relaxed font-medium shrink-0 text-right">
        {{ item?.value }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  list: {
    key: string
    value: string
  }[]
}

defineProps<Props>()
</script>
