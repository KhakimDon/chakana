<template>
  <NuxtLink
    :to="`brands/${card.id}`"
    class="w-full cursor-pointer rounded-10 border-[0.5px] border-transparent group transition-300"
  >
    <div class="w-full min-h-[113px] bg-white-100 rounded-10 flex-center">
      <nuxt-img
        :src="card.image"
        loading="lazy"
        class="w-[80px] h-[80px] object-contain"
        alt="brands"
      />
    </div>
    <p
      class="text-center mt-2.5 group-hover:text-orange transition-300 text-sm leading-130 font-semibold text-dark"
    >
      {{ card?.title }}
    </p>
  </NuxtLink>
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
