<template>
  <div>
    <h4
      class="mb-5 text-xl leading-normal font-extrabold text-dark"
      :class="titleClass"
    >
      {{ $t(title) }}
    </h4>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { TClassName } from '~/types'

interface Props {
  title: string
  titleClass?: TClassName
}

defineProps<Props>()
</script>
