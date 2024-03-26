<template>
  <div class="p-4 pt-3 rounded-xl bg-gray-300">
    <p class="text-xs leading-130 font-medium text-dark">
      {{ $t('your_address') }}
    </p>
    <p class="mt-0.5 text-sm leading-130 font-bold text-dark">
      улица Адхама Рахмата, 15
    </p>
    <img
      src="/images/fake/map.webp"
      alt="map"
      class="rounded-xl w-full h-[124px] mt-4"
    />

    <div class="flex-y-center gap-3 mt-4">
      <BaseButton class="w-full" :text="$t('yes_it_is')" />
      <BaseButton
        class="w-full"
        :text="$t('no_other')"
        variant="secondary-dark"
      />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
