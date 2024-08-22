<template>
  <div class="bg-white p-4 flex-center-between border-b border-white-100">
    <div class="flex-y-center gap-4">
      <div class="size-[56px] rounded-xl download-app-shadow shrink-0">
        <img
          src="/images/xolodilnik.png"
          alt="xolodilnik-app"
          class="size-full object-contain"
        />
      </div>
      <div>
        <p class="text-base leading-122 font-semibold">Xolodilnik</p>
        <p class="text-xs leading-130 text-gray mt-0.5">Shopping</p>
      </div>
    </div>

    <a
      href="https://app.xolodilnik.uz"
      target="_blank"
      class="px-4 py-2 bg-green rounded-2xl transition-300 text-white text-xs !leading-4 font-semibold"
    >
      {{ $t('view') }}
    </a>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
