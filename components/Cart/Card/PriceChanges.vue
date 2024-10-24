<template>
  <div class="rounded-xl bg-white-100 p-4 flex flex-col gap-4">
    <h3 class="text-base font-extrabold text-dark mb-1">
      {{ t('price_may_change') }}
    </h3>
    <article class="text-sm">
      <p class="mb-2">{{ t('price_may_change_info') }}</p>

      <p class="font-medium">
        {{ t('extra_price') }} -
        <span class="text-red">{{ formatMoneyDecimal(price) }} UZS</span>
      </p>
    </article>
  </div>
</template>

<script lang="ts" setup>
import { formatMoneyDecimal } from '@/utils/functions/common.js'

interface Props {
  price: number
}

defineProps<Props>()

const { t } = useI18n()
</script>
