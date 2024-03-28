<template>
  <div>
    <div class="flex-center-between w-full mb-5" :class="headerClass">
      <h4 class="text-xl leading-normal font-extrabold text-dark">
        {{ $t(title) }}
      </h4>

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
