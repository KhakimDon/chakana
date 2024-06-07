<template>
  <div class="space-y-3">
    <p
      class="text-dark text-base font-extrabold leading-tight"
      :class="titleClass"
    >
      {{ title }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  titleClass?: string
}

defineProps<Props>()
</script>

<style scoped></style>
