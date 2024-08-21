<template>
  <div
    v-if="show"
    class="absolute-x bottom-8 max-sm:hidden !fixed z-50 max-w-[480px] w-full"
  >
    <div class="w-full relative">
      <Transition name="fade">
        <div
          v-if="mouseOn"
          class="bg-white size-[162px] rounded-t-2xl flex justify-center ml-auto h-[196px] pt-6 -mb-6 qr-shadow"
        >
          <LayoutAuthQrGenerator size="126" :text="link" />
        </div>
      </Transition>
      <div
        class="p-2 pr-5 rounded-[20px] bg-white flex-center-between gap-2 download-app-box-shadow max-w-[480px] w-full relative z-10"
      >
        <div class="flex-y-center gap-4">
          <div class="size-[56px] rounded-xl download-app-shadow">
            <img
              src="/images/xolodilnik.png"
              alt="xolodilnik-app"
              class="size-[56px]"
            />
          </div>
          <p class="text-sm leading-122 font-semibold text-dark">
            {{ $t('download_app') }}
          </p>
        </div>

        <div class="flex-y-center gap-4">
          <a
            href="https://app.xolodilnik.uz"
            target="_blank"
            class="px-4 py-2 bg-green rounded-2xl transition-300 text-white text-xs !leading-4 font-semibold"
            @mouseenter="mouseOn = true"
            @mouseleave="mouseOn = false"
          >
            {{ $t('download') }}
          </a>
          <SvgoCommonClose
            class="cursor-pointer transition-300 hover:text-red"
            @click="show = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mouseOn = ref(false)
const show = ref(true)

const link = computed(() => {
  // if (process.client) {
  //   return window.location.origin + '/get-app'
  // }
  return 'https://app.xolodilnik.uz'
})
</script>

<style scoped>
.download-app-shadow {
  box-shadow: 0 4px 8px 0 rgba(255, 51, 0, 0.32);
}

.download-app-box-shadow {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 0 1px rgba(0, 0, 0, 0.05),
    0 4px 16px 0 rgba(0, 0, 0, 0.12);
}

.qr-shadow {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 0 1px rgba(0, 0, 0, 0.05),
    0 4px 16px 0 rgba(0, 0, 0, 0.12);
}
</style>
