<template>
  <NuxtLinkLocale
    :to="`/category/${item.id}`"
    class="flex-y-center relative gap-3 pb-1.5 before:absolute before:h-px before:bg-gray-300 before:w-[calc(100%-45px)] before:bottom-0 before:right-0 last:before:hidden group"
    :class="{ 'grayscale pointer-events-none': !item.is_active }"
  >
    <div class="w-8 h-[26px] shrink-0">
      <nuxt-img
        :src="item.image"
        :alt="`image-${item?.name}`"
        class="w-full h-full object-contain"
        :class="{'grayscale': !item.is_active }"
        loading="lazy"
      />
    </div>
    <p
      class="text-xs leading-130 text-dark font-semibold group-hover:text-orange transition-300"
    >
      {{ item?.name }}
    </p>
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import type { ICategory } from '~/types/categories'

interface Props {
  item: ICategory
}

defineProps<Props>()
</script>
