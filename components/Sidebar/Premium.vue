<template>
  <div class="rounded-2xl sidebar-premium p-px overflow-hidden">
    <div class="p-3 pt-4 bg-white rounded-[15px] flex flex-col items-center">
      <div class="relative">
        <img
          class="relative z-10"
          width="55"
          height="45"
          src="/images/svg/star-dynamic-premium.webp"
          alt="star dynamic premium"
        />
        <img
          class="absolute z-0 inset-0 opacity-70 blur-[17px]"
          width="55"
          height="45"
          src="/images/svg/star-dynamic-premium.webp"
          alt="star dynamic premium"
        />
      </div>
      <i18n-t
        keypath="more_discounts_and_coupons_with_premium_subscription"
        tag="p"
        class="text-sm text-dark font-medium leading-130 mt-2 mb-4 text-center"
      >
        <template #premium
          ><span class="font-semibold premium-text">PREMIUM</span></template
        >
      </i18n-t>
      <div
        class="mb-3 py-2.5 px-3 border border-white-100 rounded-lg w-full flex-y-center gap-2"
      >
        <SvgoProfileSidebarMoney class="text-xl leading-5 text-green" />
        <p class="text-xs font-normal leading-130 text-gray-100">
          {{ $t('price') }}:
          <span class="font-bold text-green">
            {{ formatMoneyDecimal(120000) }} {{ $t('sum') }}
          </span>
        </p>
      </div>
      <BaseButton class="w-full" :text="$t('get_access')"></BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatMoneyDecimal } from '@/utils/functions/common'
</script>

<style>
.sidebar-premium {
  background: linear-gradient(180deg, #ff831b 0%, #ff3300 100%);
  box-shadow: 0 3.97px 12px 0 #0000000f, 0 10px 80px 0 #0000000f;
}
.premium-text {
  background: -webkit-linear-gradient(180deg, #ff831b 0%, #f30 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
