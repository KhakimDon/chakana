<template>
  <main class="container grid grid-cols-12 gap-5 relative">
    <aside class="col-span-2 fixed top-[86px]">
      <slot name="left" />
    </aside>
    <div class="col-span-2" />
    <section class="col-span-7 ml-5">
      <slot />
    </section>
    <aside class="col-span-3">
      <slot name="right" />
    </aside>
  </main>
</template>
<script setup lang="ts"></script>
