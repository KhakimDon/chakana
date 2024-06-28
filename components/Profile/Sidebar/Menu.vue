<template>
  <div
    class="bg-gray-300 py-1.5 pl-2.5 rounded-xl flex flex-col items-end gap-0.5"
  >
    <template v-for="(i, idx) in menu" :key="idx">
      <NuxtLinkLocale
        :to="i.link"
        class="py-2 flex-center-between gap-1.5 w-full group"
        exact-active-class="active"
        @click="$emit('menu-click', i)"
      >
        <!--        active-class="active"-->
        <div class="flex-y-center gap-1.5">
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
          <p class="text-xs leading-130 font-semibold text-dark">
            {{ i.title }}
          </p>
        </div>
        <div
          v-if="i.isPremium"
          class="mr-2 bg-[linear-gradient(180deg,_#FF831B_0%,_#F30_100%)] rounded-full py-[3px] px-1.5 text-xs font-semibold text-white leading-130 flex-y-center gap-1 relative"
        >
          <SvgoProfileSidebarCrownFill class="text-base leading-4" />
          Pro
          <span
            class="border border-white/20 bg-transparent rounded-full absolute inset-0 z-0"
          ></span>
        </div>
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
