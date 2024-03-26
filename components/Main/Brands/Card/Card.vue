<template>
  <div class="w-full">
    <div class="w-full h-[80px] bg-white-100 rounded-10 flex-center">
      <nuxt-img
        :src="card.image"
        loading="lazy"
        class="w-[80px] h-[80px] object-contain"
      />
    </div>
    <p class="text-center mt-2.5 text-sm leading-130 font-semibold text-dark">
      {{ card?.title }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  card: {
    id: number
    title: string
    image: string
    link: string
  }
}

defineProps<Props>()
</script>
