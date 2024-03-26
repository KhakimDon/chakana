<template>
  <LayoutWrapper>
    <template #left>
      <MainSidebar class="sticky top-[86px]" />
    </template>
    <Main />
    <template #right>
      <div class="sticky top-[86px]">
        <MainMap />
        <div class="mt-5">
          <p class="text-xl leading-normal font-extrabold text-dark">
            {{ $t('basket') }}
          </p>
          <CommonNoData
            image="/images/no-data/no-basket.webp"
            title="empty_basket"
            subtitle="empty_basket_text"
            title-class="!max-w-full"
            subtitle-class="!max-w-full"
          />
        </div>
      </div>
    </template>
  </LayoutWrapper>
</template>
<script setup lang="ts"></script>
