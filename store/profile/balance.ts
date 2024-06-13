export const useBalanceStore = defineStore('balanceStore', {
  state: () => ({
    balance: 0,
  }),
  actions: {
    fetchBalance() {
      useApi()
        .$get('/get/balance')
        .then((res: { balance: number }) => {
          this.balance = res.balance
        })
    },
    fillBalance(data) {
      return new Promise((resolve, reject) => {
        useApi()
          .$post('/add/balance', { body: data })
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },
})
