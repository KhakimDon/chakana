<template>
  <div>
    <div class="flex-center-between mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('my_cards') }}
      </h1>
      <button
        class="flex-y-center gap-1 text-red text-sm font-semibold leading-5 transition-300 group hover:text-orange"
        @click="addCardModal = true"
      >
        <SvgoCommonPlus
          class="text-xl leading-5 text-red transition-300 group-hover:text-orange"
        />
        {{ $t('add_card') }}
      </button>
    </div>
    <Transition name="fade" mode="out-in">
      <div :key="cards.loading" class="grid grid-cols-2 gap-5">
        <template v-if="cards.loading">
          <ProfileMyCardLoading v-for="i in 4" :key="i" />
        </template>
        <template v-else-if="cards.list.length">
          <ProfileMyCard
            v-for="item in cards.list"
            :key="item.id"
            :item
            @delete="deleteConfirm"
          />
        </template>
        <template v-else>
          <CommonNoData
            class="col-span-2"
            :title="$t('no_cards_yet')"
            :subtitle="$t('you_still_dont_have_cards')"
          >
            <template #actions>
              <BaseButton
                class="mt-4"
                :text="$t('add_card')"
                @click="addCardModal = true"
              />
            </template>
          </CommonNoData>
        </template>
      </div>
    </Transition>
    <ProfileModalCardDelete
      v-model="deleteModal"
      :active-card="activeCard"
      :delete-loading="deleteLoading"
      @delete="deleteCard"
    />
    <ProfileModalCardAdd v-model="addCardModal" />
  </div>
</template>

<script setup lang="ts">
import { useCardsStore } from '~/store/profile/cards'
import type { IBankCard } from '~/types/profile'

const cardsStore = useCardsStore()
const cards = computed(() => cardsStore.cards)
const deleteLoading = computed(() => cardsStore.deleteLoading)
cardsStore.fetchCards()

const activeCard = ref<IBankCard | null>(null)

const deleteModal = ref(false)
const deleteConfirm = (card: IBankCard) => {
  activeCard.value = card
  deleteModal.value = true
}

const deleteCard = () => {
  cardsStore.deleteCard(activeCard.value!).then(() => {
    deleteModal.value = false
  })
}

const addCardModal = ref(false)
</script>
