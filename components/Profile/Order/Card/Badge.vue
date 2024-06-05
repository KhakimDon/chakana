<template>
  <div
    class="flex items-center w-fit px-1.5 py-[3px] rounded-md"
    :class="typesStyle[type]"
  >
    <div class="mr-1">
      <SvgoCommonCheck v-if="type === 'accepted'" />
      <SvgoCommonBag v-else-if="type === 'collected'" />
      <SvgoCommonMap v-else />
    </div>

    <span class="text-xs leading-130">{{ $t(typesText[type]) }}</span>
  </div>
</template>

<script setup lang="ts">
import type { TOrderStatuses } from '~/types/profile.js'

defineProps<{ type: TOrderStatuses }>()

const typesStyle: Record<TOrderStatuses, string> = {
  accepted: 'text-blue-100 bg-blue-100/[.08]',
  collected: 'text-orange bg-orange/[.14]',
  delivered: 'text-[#CFA600] bg-[#CFA600]/[.14]',
}

const typesText: Record<TOrderStatuses, string> = {
  accepted: 'order_accepted',
  collected: 'order_collecting',
  delivered: 'order_delivering',
}
</script>
