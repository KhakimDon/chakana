import type { IUser } from '~/types/auth'
import { useCartStore } from '~/store/cart.js'
import { useChakanaApi } from '~/composables/useChakanaApi'

interface TAuthTokens {
  refresh_token?: string
  access_token: string
}

interface IState {
  user?: IUser
  reasons: any[]
  userFetchTrigger: number
  showAuth: boolean
  authMode: 'login' | 'register'
  accessToken?: string | null
  refreshToken?: string | null
  userFetched: boolean
}

export const useAuthStore = defineStore('authStore', {
  state: (): IState => ({
    user: {} as IUser,
    reasons: [],
    userFetchTrigger: 0,
    showAuth: false,
    authMode: 'login',
    accessToken: undefined,
    refreshToken: undefined,
    userFetched: false,
  }),
  actions: {
    fetchUser() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get<IUser>('auth/profile/')
          .then((res) => {
            this.user = res
            this.userFetched = true
            this.userFetchTrigger++
            useCartStore().getCartProducts()
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    updateUser(user: IUser) {
      return new Promise((resolve, reject) => {
        useApi()
          .$patch<IUser>('auth/profile/update/', {
            body: user,
          })
          .then((res) => {
            resolve(res)
            this.fetchUser()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteAccount(id: string) {
      return new Promise((resolve, reject) => {
        useApi()
          .$post<IUser>('auth/delete-account/', {
            body: {},
          })
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    getDeleteAccountReasons() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get('reasons/?reason_type=delete_account')
          .then((res) => {
            this.reasons = res
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    sendReason(body: any) {
      return new Promise((resolve, reject) => {
        useApi()
          .$post('send/reason/', {
            body: {
              order_id: null,
              reason_ids: body.ids?.length ? body.ids : [],
              reason_text: body.text ?? null,
            },
          })
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    getTokens() {
      const access = useCookie('access_token')
      const refresh = useCookie('refresh_token')

      this.accessToken = access.value
      this.refreshToken = refresh.value
      return { access: this.accessToken, refresh: this.refreshToken }
    },
    setTokens(payload: TAuthTokens) {
      if (payload?.access_token) {
        const access = useCookie('access_token')
        access.value = payload.access_token
        this.accessToken = payload.access_token
      }
      if (payload?.refresh_token) {
        const refresh = useCookie('refresh_token')
        refresh.value = payload.refresh_token
        this.refreshToken = payload.refresh_token
      }
    },
    async authInit() {
      this.getTokens()

      if (!this.accessToken || !this.refreshToken) {
        return
      }

      try {
        await this.fetchUser()
      } catch (e) {}
    },
    refreshTokens() {
      return new Promise((resolve, reject) => {
        const tokens = this.getTokens()

        if (!tokens.refresh) {
          this.logOut()
          reject(new Error('No refresh token available'))
          return
        }

        // Пробуем использовать Chakana API для обновления токена
        const chakanaApi = useChakanaApi()
        
        chakanaApi
          .refreshToken(tokens.refresh)
          .then((res) => {
            if (res.access) {
              this.setTokens({
                access_token: res.access,
                refresh_token: tokens.refresh, // Сохраняем refresh token
              })
              resolve(res.access)
            } else {
              // Если Chakana API не сработал, пробуем Identity API
              const identityApi = useIdentityApi()
              if (tokens.access) {
                identityApi
                  .refreshToken(tokens.access, tokens.refresh, false)
                  .then((identityRes) => {
                    if (identityRes.authToken) {
                      this.setTokens({
                        access_token: identityRes.authToken,
                        refresh_token: tokens.refresh,
                      })
                      resolve(identityRes.authToken)
                    } else {
                      this.logOut()
                      reject(new Error('Invalid refresh response'))
                    }
                  })
                  .catch((err) => {
                    this.logOut()
                    reject(err)
                  })
              } else {
                this.logOut()
                reject(new Error('Invalid refresh response'))
              }
            }
          })
          .catch((err) => {
            // Если Chakana API не сработал, пробуем Identity API
            const identityApi = useIdentityApi()
            if (tokens.access && tokens.refresh) {
              identityApi
                .refreshToken(tokens.access, tokens.refresh, false)
                .then((res) => {
                  if (res.authToken) {
                    this.setTokens({
                      access_token: res.authToken,
                      refresh_token: tokens.refresh,
                    })
                    resolve(res.authToken)
                  } else {
                    this.logOut()
                    reject(new Error('Invalid refresh response'))
                  }
                })
                .catch((identityErr) => {
                  this.logOut()
                  reject(identityErr)
                })
            } else {
              this.logOut()
              reject(err)
            }
          })
      })
    },
    logOut() {
      this.user = undefined
      this.accessToken = null
      this.refreshToken = null
      const access = useCookie('access_token')
      access.value = null
      const refresh = useCookie('refresh_token')
      refresh.value = null

      useCartStore().$reset()
    },
    getDeviceID(id: string) {
      return new Promise((resolve, reject) => {
        useApi()
          .$get('/get/device')
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // eslint-disable-next-line camelcase
    sendSms(phone_number: string, type_ = 'login_sms_verification') {
      return new Promise((resolve, reject) => {
        useApi()
          .$post<{ session: string }>('auth/phone/send-sms/', {
            body: {
              // eslint-disable-next-line camelcase
              phone_number,
            },
          })
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },
  getters: {
    isAuthorized: (state) => !!state.user?.id,
  },
})
