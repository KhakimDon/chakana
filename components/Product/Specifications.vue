<template>
  <div class="flex flex-col gap-1.5">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="flex-center-between gap-1"
    >
      <p class="text-sm text-gray-100 leading-130 shrink-0">{{ item?.key }}</p>
      <div
        class="w-full relative before:absolute before:w-full before:border before:border-dashed"
      />
      <p class="text-sm text-dark leading-130 font-medium shrink-0">
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
