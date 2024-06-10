<template>
  <div
    class="border border-white-100 rounded-md p-1 cursor-pointer"
    @click="choosePromo"
  >
    <div class="flex-y-center gap-2 justify-between py-3 select-none px-2">
      <p class="text-sm font-bold leading-130 text-dark">{{ promo?.code }}</p>
      <div class="flex-y-center justify-end gap-2">
        <p class="text-green text-xs font-medium leading-none">
          {{ dayjs(promo?.date).format('DD.MM.YYYY') }}
        </p>
        <FormRadio v-if="selected" class="!p-0 max-w-[20px]" />
        <FormRadio v-else value="true" class="!p-0 max-w-[20px]" />
      </div>
    </div>
    <i18n-t
      keypath="active_price"
      tag="p"
      class="bg-white-100 p-2 rounded text-xs text-gray-100 font-medium leading-none w-full"
    >
      <template #price>
        <span class="text-xs font-bold leading-none text-dark">
          {{ formatMoneyDecimal(promo?.minimum_price ?? 0, 0) }}
          <span class="text-[10px] font-bold text-dark leading-[13px]">
            UZS
          </span>
        </span>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  promo: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'choose', value: string): void
}>()

const selected = ref()
const choosePromo = () => {
  selected.value = !selected.value
  emit('choose', props.promo?.id)
}
</script>

<style scoped></style>
