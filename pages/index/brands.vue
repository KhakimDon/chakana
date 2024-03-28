<template>
  <CommonSectionWrapper title="brands">
    <div class="grid grid-cols-4 gap-4">
      <MainBrandsCard v-for="(card, index) in brands" :key="index" :card />
      <MainBrandsCardLoading
        v-for="(card, index) in brands"
        :key="index"
        :card
      />
    </div>
  </CommonSectionWrapper>
</template>
<script setup lang="ts">
import { brands } from '~/data'
</script>
