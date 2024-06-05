<template>
  <div class="p-3 bg-gray-300 rounded-[10px] flex-center-between">
    <div class="flex-y-center gap-2 text-sm leading-130 font-bold text-dark">
      <img
        width="24"
        height="24"
        :src="`/images/svg/payments/${item.processing?.toLowerCase()}.svg`"
        :alt="item.processing"
      />
      {{ item.card_number }}
    </div>
    <button>
      <SvgoCommonTrash
        class="text-2xl leading-6 text-gray hover:text-red transition-300"
        @click="$emit('delete', item)"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { IBankCard } from '~/types/profile'

interface Props {
  item: IBankCard
}
defineProps<Props>()

defineEmits<{
  (e: 'delete', item: IBankCard): void
}>()
</script>
