const BASE_URL = import.meta.env.VITE_API_BASE_URL

export default async () => {
  const fingerprint = useCookie('fingerprint')
  const data = await fetch(`${BASE_URL}/translations`, {
    headers: {
      'Accept-Language': 'en',
      'Device-Id': fingerprint.value,
    },
  })
  return await data.json()
}
