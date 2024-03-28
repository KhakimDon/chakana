<template>
  <NuxtLink
    to="/category/3"
    class="flex-y-center gap-1.5 py-2 px-3 rounded-full bg-[#F3F3F3] hover:bg-white transition-300 border border-transparent hover:border-orange"
  >
    <div class="w-1.5 h-1.5 rounded-full bg-orange" />
    <p class="text-xs leading-normal font-semibold text-dark">{{ title }}</p>
  </NuxtLink>
</template>
<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>
