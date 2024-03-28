<template>
  <div class="w-full">
    <div class="grid grid-cols-2 gap-3">
      <a href="#" target="_blank">
        <img
          src="/images/fake/banner-1.webp"
          alt="banner"
          class="w-full max-h-[150px] h-full object-cover rounded-10"
        />
      </a>
      <a href="#" target="_blank">
        <img
          src="/images/fake/banner-2.webp"
          alt="banner"
          class="w-full max-h-[150px] h-full object-cover rounded-10"
        />
      </a>
    </div>
    <div class="w-full flex-y-center gap-2 mt-4">
      <NuxtLink to="/search" class="w-full">
        <FormInputSearch :placeholder="$t('search')" class="w-full !h-10" />
      </NuxtLink>
      <button
        class="w-10 h-10 rounded-lg bg-white-100 flex-center shrink-0 hover:bg-[#4DAAF81F] transition-300"
        aria-label="list-button"
      >
        <IconList class="text-2xl text-[#4DAAF8]" />
      </button>
    </div>
    <CommonSectionWrapper title="take_and_go" class="mt-4">
      <div class="grid grid-cols-4 gap-x-4 gap-y-10">
        <MainCard
          v-for="(card, index) in [...cards, ...cards]"
          :key="index"
          :card
        />
        <!--        <MainCardLoading v-for="key in 4" :key />-->
      </div>
    </CommonSectionWrapper>
    <CommonSectionWrapper title="popular_brands" class="my-6">
      <MainBrandsWrapper />
    </CommonSectionWrapper>
    <CommonSectionWrapper title="profitable_shelf" class="my-6">
      <div class="grid grid-cols-4 gap-x-4 gap-y-10">
        <MainCard
          v-for="(card, index) in [...cards, ...cards]"
          :key="index"
          :card
        />
        <MainCardLoading v-for="key in 4" :key />
      </div>
    </CommonSectionWrapper>
  </div>
</template>

<script setup lang="ts">
import IconList from '~/assets/icons/Common/list.svg'
import { cards } from '~/data'
</script>
