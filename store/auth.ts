import type { IUser } from '~/types/auth'

interface TAuthTokens {
  refresh_token?: string
  access_token: string
}

interface IState {
  user?: IUser
  reasons: any[]
  userFetchTrigger: number
  showAuth: boolean
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
    accessToken: undefined,
    refreshToken: undefined,
    userFetched: false,
  }),
  actions: {
    fetchUser() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get<IUser>('get/detail')
          .then((res) => {
            this.user = res
            this.userFetched = true
            this.userFetchTrigger++
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
          .$put<IUser>('update/detail', {
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
          .$delete<IUser>(`delete/account/?reason_id=${id}`)
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
        useApi()
          .$post<{ access: string }>('/sso/api/v1/TokenRefresh/', {
            body: {
              refresh: this.refreshToken,
            },
          })
          .then((res) => {
            if (res.error) {
              this.logOut()
              reject(res.error)
            } else {
              this.setTokens(res.access)
              resolve(res.access)
            }

            this.setTokens({
              access: res.access,
            })
          })
          .catch((err) => {
            this.logOut()
            reject(err)
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
          .$post<{ code: string }>('/send-sms', {
            body: {
              // eslint-disable-next-line camelcase
              phone_number,
              type_,
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
