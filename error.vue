<template>
  <div>
    <LayoutHeader />

    <div class="min-h-[calc(100vh-70px)] relative container flex items-center">
      <div>
        <p class="text-orange leading-normal text-9xl font-bold">404</p>
        <p class="text-xl leading-normal font-semibold text-dark">
          {{ $t('error_text') }}
        </p>

        <NuxtLink to="/" class="mt-7 block">
          <BaseButton class="px-[26px]" :text="$t('back_home')" />
        </NuxtLink>
      </div>
      <nuxt-img
        src="/images/error.png"
        loading="lazy"
        class="absolute-y max-w-[715px] right-10"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  error: any
}
defineProps<Props>()
</script>
