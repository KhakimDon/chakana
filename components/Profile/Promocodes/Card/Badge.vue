<template>
  <div class="px-2 py-0.5 rounded-[15px]" :class="typeBgStyles[type]">
    <p
      class="font-medium text-[10px] leading-120"
      :class="typeTextStyles[type]"
    >
      {{ $t(type) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { TPromocodeStatuses } from '~/types/profile'

defineProps<{ type: TPromocodeStatuses }>()

const typeBgStyles: Record<TPromocodeStatuses, string> = {
  available: 'bg-green/[.10]',
  used: 'bg-green/[.10]',
  expired: 'bg-white-100',
}

const typeTextStyles: Record<TPromocodeStatuses, string> = {
  available: 'text-green',
  used: 'text-green',
  expired: 'text-gray-100',
}
</script>
