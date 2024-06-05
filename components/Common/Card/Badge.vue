<template>
  <div
    class="flex items-center w-fit px-1.5 py-[3px] rounded-md"
    :class="typesStyle[type]"
  >
    <div class="mr-1">
      <SvgoCommonCheck v-if="type === 'accepted'" />
      <SvgoCommonBag v-else-if="type === 'collecting'" />
      <SvgoCommonMap v-else />
    </div>

    <span class="text-xs leading-130">{{ $t(typesText[type]) }}</span>
  </div>
</template>

<script setup lang="ts">
import type { TOrderBadgeTypes } from '~/types/components/card'

defineProps<{ type: TOrderBadgeTypes }>()

const typesStyle: Record<TOrderBadgeTypes, string> = {
  accepted: 'text-blue-100 bg-blue-100/[.08]',
  collecting: 'text-orange bg-orange/[.14]',
  delivering: 'text-[#CFA600] bg-[#CFA600]/[.14]',
}

const typesText: Record<TOrderBadgeTypes, string> = {
  accepted: 'order_accepted',
  collecting: 'order_collecting',
  delivering: 'order_delivering',
}
</script>

<style scoped></style>
