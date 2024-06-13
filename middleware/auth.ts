export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('access_token')
  const refresh = useCookie('refresh_token')
  if (!token.value || !refresh.value) {
    return navigateTo('/', { redirectCode: 301 })
  }
})
