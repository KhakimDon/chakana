<template>
  <NuxtLink
    :to="`/category/${item.id}`"
    class="flex-y-center relative gap-3 pb-1.5 before:absolute before:h-px before:bg-gray-300 before:w-[calc(100%-45px)] before:bottom-0 before:right-0 last:before:hidden group"
  >
    <div class="w-8 h-[26px] shrink-0">
      <nuxt-img
        :src="item.image"
        :alt="`image-${item?.title}`"
        class="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
    <p
      class="text-xs leading-130 text-dark font-semibold group-hover:text-orange transition-300"
    >
      {{ item?.title }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  item: {
    id: number
    image: string
    title: string
  }
}

defineProps<Props>()
</script>
