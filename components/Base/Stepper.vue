<template>
  <div class="flex-center gap-2">
    <template v-for="(item, index) in steps" :key="item.id">
      <div
        class="w-12 h-12 shrink-0 border rounded-xl flex-center transition-300"
        :class="detectIconClass(index)"
      >
        <component :is="item.icon" class="text-[32px] leading-[32px]" />
      </div>
      <div
        class="h-px w-12 last:hidden transition-300"
        :class="index < activeIndex ? 'bg-orange' : 'bg-gray-200'"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  steps: {
    id: number | string
    icon: Component
  }[]
  step: number | string
}
const props = defineProps<Props>()

const activeIndex = computed(() =>
  props.steps.findIndex((item) => item.id === props.step)
)

const detectIconClass = (idx: number) => {
  if (activeIndex.value === idx) {
    return 'border-white/40 bg-[linear-gradient(180deg,_#FF831B_0%,_#F30_100%)] shadow-[0_9px_28px_0_rgba(255,_74,_8,_0.58)] text-white'
  } else if (idx < activeIndex.value) {
    return 'border-orange text-orange bg-white'
  }
  return 'text-gray-100 border-white-100 bg-white-100'
}
</script>
