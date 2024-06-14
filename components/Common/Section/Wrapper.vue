<template>
  <div>
    <slot name="header" />
    <div class="flex-center-between w-full mb-5" :class="headerClass">
      <div class="flex items-center gap-2 group">
        <slot name="beforeTitle" />
        <h4
          :class="titleLink ? 'cursor-pointer' : 'cursor-default'"
          class="text-xl leading-normal font-extrabold text-dark"
          @click="titleLink ? router.back() : ''"
        >
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

const router = useRouter()

interface Props {
  title: string
  headerClass?: TClassName
  titleLink?: boolean
}

defineProps<Props>()
</script>
