<template>
  <div>
    <div class="flex-center-between w-full mb-5" :class="headerClass">
      <div class="flex items-center gap-2">
        <slot name="beforeTitle" />
        <h4 class="text-xl leading-normal font-extrabold text-dark">
          {{ $t(title) }}
        </h4>
      </div>

      <slot name="action" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { TClassName } from '~/types'

interface Props {
  title: string
  headerClass?: TClassName
}

defineProps<Props>()
</script>
