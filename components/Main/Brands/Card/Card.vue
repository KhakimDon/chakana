<template>
  <NuxtLinkLocale
    :to="`/brands/${card.id}`"
    class="w-full p-3 rounded-10 border-[0.5px] border-transparent hover:border-orange hover:shadow-[0_2px_16px_0_rgba(255,131,27,0.08)] transition-300"
  >
    <div class="w-full bg-white-100 rounded-10 flex-center">
      <nuxt-img
        :src="card.image"
        loading="lazy"
        class="w-[80px] h-[80px] object-contain"
        alt="brands"
      />
    </div>
    <p class="text-center mt-2.5 text-sm leading-130 font-semibold text-dark">
      {{ card?.title }}
    </p>
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
interface Props {
  card: {
    id: number
    title: string
    image: string
  }
}

defineProps<Props>()
</script>
