<template>
  <div>
    <LayoutHeader
      v-if="useMobile('desktop')"
      class="fixed top-0 bg-white z-10"
    />
    <LayoutHeaderMobile v-else class="fixed top-0 bg-white z-10" />
    <div class="pb-10 md:mt-[86px]">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
