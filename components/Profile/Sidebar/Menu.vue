<template>
  <div
    class="bg-gray-300 py-1.5 pl-2.5 rounded-xl flex flex-col items-end gap-0.5"
  >
    <template v-for="(i, idx) in menu" :key="idx">
      <NuxtLinkLocale
        :to="i.link"
        class="py-2 flex items-center gap-1.5 w-full group"
        exact-active-class="active"
        @click="$emit('menu-click', i)"
      >
        <!--        active-class="active"-->
        <span
          class="w-6 h-6 rounded-md flex-center transition-300"
          :class="i.iconWrapperClass"
        >
          <component
            :is="i.icon"
            :class="i.iconClass"
            class="text-xl leading-5 transition-300"
          />
        </span>
        <p class="text-xs leading-130 font-semibold text-dark">{{ i.title }}</p>
      </NuxtLinkLocale>
      <div class="w-[calc(100%-30px)] h-px bg-gray-200 last:hidden"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

type MenuItem = {
  title: string
  link: string
  icon: Component
  iconClass: string
  iconWrapperClass: string
}

interface Props {
  menu: MenuItem[]
}
defineProps<Props>()

defineEmits<{
  (e: 'menu-click', item: MenuItem): void
}>()
</script>
