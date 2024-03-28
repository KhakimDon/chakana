<template>
  <CommonSectionWrapper title="take_and_go" class="mt-4">
    <div class="grid grid-cols-4 gap-x-4 gap-y-10">
      <MainCard
        v-for="(card, index) in [...cards, ...cards]"
        :key="index"
        :card
      />
      <MainCardLoading v-for="key in 4" :key />
    </div>
  </CommonSectionWrapper>
</template>
<script setup lang="ts">
import { cards } from '~/data'
</script>
