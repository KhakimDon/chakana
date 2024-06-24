export const useModalStore = defineStore('modalStore', {
  state: () => ({
    addressModel: false,
    addressMapModel: false,
    clockModel: false,
    userModel: false,
    commentModel: false,
    promoModel: false,
    paymentModel: false,
    autoOrderModel: {
      name: false,
      whenToDelivery: false,
      payment: false,
    },
  }),
  actions: {},
})
