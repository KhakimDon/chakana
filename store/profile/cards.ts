export const useCardsStore = defineStore('cardsStore', {
  state: () => ({
    cards: {
      list: [] as string[],
      loading: true,
    },
  }),
  actions: {
    fetchCards() {
      useApi()
        .$get<string[]>('/card/list')
        .then((res) => {
          this.cards.list = res
        })
        .finally(() => {
          this.cards.loading = false
        })
    },
  },
})
