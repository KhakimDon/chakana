<template>
  <main class="container grid grid-cols-1 md:grid-cols-12 gap-5 relative">
    <aside
      class="col-span-2 hidden md:block"
      :class="{ 'fixed top-[86px]': hasFixed }"
    >
      <slot name="left" />
    </aside>
    <div v-if="hasFixed" class="col-span-2 hidden md:block" />
    <section class="col-span-7">
      <slot />
    </section>
    <aside class="col-span-3 hidden md:block">
      <slot name="right" />
    </aside>
  </main>
</template>
<script setup lang="ts">
interface Props {
  hasFixed?: boolean
}

defineProps<Props>()
</script>
