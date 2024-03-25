<template>
  <main class="container grid grid-cols-12 gap-5">
    <aside class="col-end-2">
      <slot name="left" />
    </aside>
    <section class="col-span-7">
      <slot />
    </section>
    <aside class="col-span-3">
      <slot name="right" />
    </aside>
  </main>
</template>
<script setup lang="ts"></script>
