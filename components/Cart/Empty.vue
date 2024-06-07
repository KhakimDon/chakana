<template>
  <section>
    <div class="mt-5 bg-white-100 rounded-10 p-4">
      <p class="text-lg font-bold leading-normal text-dark">
        {{ $t('basket') }}
      </p>
      <CommonNoData
        image="/images/svg/cart.svg"
        title="empty_basket"
        subtitle="empty_basket_text"
        title-class="!max-w-full"
        subtitle-class="!max-w-full"
      />
    </div>
    <div
      class="mt-5 flex-y-center bg-white-100 justify-between rounded-10 py-2 px-3"
    >
      <p class="text-xs font-normal text-gray-100 leading-none">
        {{ $t('go_payment') }}
      </p>
      <p class="text-xs font-bold leading-snug text-gray-100">
        <span class="text-base font-bold text-dark leading-normal">
          {{ formatMoneyDecimal(0, 0) }}
        </span>
        UZS
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatMoneyDecimal } from '~/utils/functions/common.js'
</script>

<style scoped></style>
