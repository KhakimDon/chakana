<template>
  <div>
    <pre>{{ cards }}</pre>
    <div class="flex-center-between mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('my_cards') }}
      </h1>
      <button
        class="flex-y-center gap-1 text-red text-sm font-semibold leading-5 transition-300 group hover:text-orange"
      >
        <SvgoCommonPlus
          class="text-xl leading-5 text-red transition-300 group-hover:text-orange"
        />
        {{ $t('add_card') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCardsStore } from '~/store/profile/cards'

const cardsStore = useCardsStore()
const cards = computed(() => cardsStore.cards)
cardsStore.fetchCards()
</script>

<style scoped></style>
