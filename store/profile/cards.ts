import type { IBankCard } from '~/types/profile'

export const useCardsStore = defineStore('cardsStore', {
  state: () => ({
    cards: {
      list: [] as IBankCard[],
      loading: true,
    },
    deleteLoading: false,
  }),
  actions: {
    fetchCards() {
      useApi()
        .$get<IBankCard[]>('/card/list')
        .then((res) => {
          this.cards.list = res
        })
        .finally(() => {
          this.cards.loading = false
        })
    },
    deleteCard(card: IBankCard) {
      this.deleteLoading = true
      return new Promise((resolve, reject) => {
        useApi()
          .$delete(`/card/delete/${card.id}`)
          .then((res) => {
            this.cards.list = this.cards.list.filter(
              (item) => item.id !== card.id
            )
            resolve(res)
          })
          .catch((error) => {
            const { handleError } = useErrorHandling()
            handleError(error)
            reject(error)
          })
          .finally(() => {
            this.deleteLoading = false
          })
      })
    },
  },
})
