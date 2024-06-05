import type { IProfileUser, IUser, IUserForm } from '~/types/auth'

interface TAuthTokens {
  refresh?: string
  access: string
}

interface IState {
  user?: IProfileUser
  showAuth: boolean
  accessToken?: string | null
  refreshToken?: string | null
  userFetched: boolean
}

export const useAuthStore = defineStore('authStore', {
  state: (): IState => ({
    user: {
      id: 1,
    } as IProfileUser,
    showAuth: false,
    accessToken: undefined,
    refreshToken: undefined,
    userFetched: false,
  }),
  actions: {
    fetchUser() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get<IProfileUser>('review/api/v1/front_office/UserDetail/')
          .then((res) => {
            this.user = res
            this.userFetched = true
            resolve(res)
          })
          .catch((error) => {
            reject(error)
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
      if (payload?.access) {
        const access = useCookie('access_token')
        access.value = payload.access
        this.accessToken = payload.access
      }
      if (payload?.refresh) {
        const refresh = useCookie('refresh_token')
        refresh.value = payload.refresh
        this.refreshToken = payload.refresh
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
  },
  getters: {
    isAuthorized: (state) => !!state.user?.id,
  },
})
