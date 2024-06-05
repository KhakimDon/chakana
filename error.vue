<template>
  <div>
    <LayoutHeader />

    <div class="min-h-[calc(100vh-70px)] relative container flex items-center">
      <div>
        <p class="text-orange leading-normal text-9xl font-bold">
          {{ errorCode === 404 ? '404' : '500' }}
        </p>
        <p class="text-xl leading-normal font-semibold text-dark">
          {{ $t(errorCode === 404 ? 'error_text' : 'error_500_text') }}
        </p>

        <NuxtLinkLocale to="/" class="mt-7 block">
          <BaseButton class="px-[26px]" :text="$t('back_home')" />
        </NuxtLinkLocale>
      </div>
      <nuxt-img
        :src="errorCode === 404 ? '/images/error.png' : '/images/error-500.png'"
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
const props = defineProps<Props>()

const errorCode = ref(props.error.statusCode)
</script>
