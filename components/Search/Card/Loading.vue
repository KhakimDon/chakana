<template>
  <div class="my-5 space-y-3">
    <div
      v-for="key in count"
      :key
      class="w-full flex gap-2 items-center rounded-10 p-2 border border-white-100 bg-white"
    >
      <div
        class="border bg-white shrink-0 border-white-100 w-16 relative h-[52px] rounded-10 px-0.5 shimmer"
      />
      <div class="flex items-center justify-between w-full gap-3">
        <div class="space-y-1 w-full">
          <div class="h-7 w-3/4 shimmer rounded-10"></div>
          <div class="h-5 w-10 shimmer rounded-10"></div>
        </div>
        <div class="h-10 w-24 shimmer rounded-10"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 5,
})
</script>

<style scoped></style>
