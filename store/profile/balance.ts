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
    // getSubscription() {
    //   return new Promise((resolve, reject) => {
    //     useApi()
    //       .$get('/user-subscription/create')
    //       .then((res) => {
    //         resolve(res)
    //       })
    //       .catch((err) => {
    //         reject(err)
    //       })
    //   })
    // },
  },
})
