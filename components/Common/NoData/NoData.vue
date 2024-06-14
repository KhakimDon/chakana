<template>
  <div class="py-12 flex flex-col items-center">
    <slot name="img">
      <img
        :src="image"
        :class="imageClass"
        alt="no-data-image"
        loading="lazy"
        class="mx-auto min-h-[157px] h-full max-w-[150px] w-full object-contain"
      />
    </slot>

    <slot name="text" />

    <p
      v-if="title"
      class="text-lg leading-130 font-bold text-dark text-center mx-auto mt-6 md:max-w-[50%]"
      :class="titleClass"
    >
      {{ $t(title) }}
    </p>
    <slot name="subtitle">
      <p
        v-if="subtitle"
        class="mt-2 text-xs leading-130 text-gray-100 md:max-w-[50%] mx-auto text-center"
        :class="subtitleClass"
      >
        {{ $t(subtitle) }}
      </p>
    </slot>
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
import type { TClassName } from '~/types'

interface Props {
  image?: string
  subtitle?: string
  subtitleClass?: TClassName
  title: string
  titleClass?: TClassName
  imageClass?: TClassName
  awardPrice?: string
}

withDefaults(defineProps<Props>(), {
  image: '/images/no-data/no-searches.png',
  title: 'no_data_search',
})
</script>
