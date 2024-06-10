<template>
  <div class="text-center pt-8">
    <h1 class="text-2xl font-extrabold leading-130 text-dark mb-1">
      {{ $t('get_your_order') }}
    </h1>
    <p class="text-sm leading-140 text-dark">{{ $t('how_the_order') }}</p>
    <FormRatePicker v-model="star" class="justify-center mt-6" />
  </div>
</template>

<script setup lang="ts">
const star = ref(0)
</script>
