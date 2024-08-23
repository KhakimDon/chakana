const timeouts: Record<string, any> = {}

const cTimeout = (key = 'key') => {
  if (timeouts[key]) {
    clearTimeout(timeouts[key])
    timeouts[key] = undefined
  }
}
export const debounce = (key = 'key', fn = () => {}, timeout = 500) => {
  const sTimeout = (key: string, fn: any, timeout: number) => {
    cTimeout(key)

    timeouts[key] = setTimeout(() => {
      try {
        fn()
      } catch (e) {}

      timeouts[key] = undefined
    }, timeout)
  }

  return sTimeout(key, fn, timeout)
}

export const moneyMask = {
  mask: [
    'D',
    'D#',
    'D##',
    'D ###',
    'D# ###',
    'D## ###',
    'D ### ###',
    'D# ### ###',
    'D## ### ###',
    'D ### ### ###',
  ],
  tokens: {
    D: {
      pattern: /[1-9]/,
    },
  },
}

const validPhones = [
  '90',
  '91',
  '33',
  '50',
  '93',
  '94',
  '88',
  '95',
  '97',
  '98',
  '99',
  '77',
  '20',
  '88',
  '50',
]
export const isValidPhone = (val: string) => {
  const phone = val.replace(/[\s)(-]/g, '')
  return phone.length === 9 && validPhones.includes(phone.substring(0, 2))
}

export function formatMoneyDecimal(number: any, fix = 0, option = 'decimal') {
  let style: string
  if (['USD', 'RUB'].includes(option)) {
    style = 'currency'
  } else if (['kilogram', 'meter', 'percent'].includes(option)) {
    style = 'unit'
  } else {
    style = ''
  }

  const newStyle: string = style
  const option2 = {
    newStyle, //  unit currency percent decimal
    [newStyle]: option,
    maximumFractionDigits: fix,
    minimumFractionDigits: fix,
  }
  return number ? new Intl.NumberFormat('ru-RU', option2).format(number) : '0'
}

export function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime() // Timestamp
  let d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0 // Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 // random number between 0 and 16
    if (d > 0) {
      // Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
export function formatPhoneNumber(phoneNumber: string) {
  // Remove any non-digit characters
  if (phoneNumber) {
    const cleanedNumber = phoneNumber.replace(/\D/g, '')

    // Check if the cleaned number has 12 digits
    if (cleanedNumber.length !== 12) {
      return phoneNumber
    }

    // Use regex capturing groups to format the number
    return cleanedNumber.replace(
      /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
      '+$1 $2 $3-$4-$5'
    )
  }
}

export const checkExpireDate = (value: any) => {
  const month = value.slice(0, 2)
  const year = value.slice(3, 5)

  const currentMonth = new Date().getMonth() + 1
  const currentYear = String(new Date().getFullYear()).slice(2, 5)
  const checkMonth =
    +month <= 12 &&
    (+year !== +currentYear ||
      (+year === +currentYear && +month >= currentMonth))
  const checkYear = year >= currentYear && year <= +currentYear + 5

  return checkYear && checkMonth
}

export const getImageSize = (
  card: any,
  url: string,
  size: 'small' | 'medium' | 'large'
) => {
  const sizes = {
    small: 256,
    medium: 578,
    large: 1024,
  }

  const newUrl = url?.split('_')

  if (card?.thumbnails?.image_256 && size === 'small') {
    return card?.thumbnails?.image_256
  } else if (card?.thumbnails?.image_512 && size === 'medium') {
    return card?.thumbnails?.image_512
  } else if (card?.thumbnails?.image_1024 && size === 'large') {
    return card?.thumbnails?.image_1024
  }
  return newUrl?.[0] + '_' + sizes[size]
}

export const share = (network: string, title: string) => {
  if (process.client) {
    switch (network) {
      case 'telegram':
        window.open(
          `https://t.me/share/url?url=${window.location.href}&text=${title}`,
          '_blank'
        )
        break
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${title}\n+${window.location.href}`,
          '_blank'
        )
        break
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?t=${title}\n${window.location.href}`,
          '_blank'
        )
        //   write for whatsapp
        break
      case 'whatsapp':
        window.open(
          `https://api.whatsapp.com/send?text=${title}\n${window.location.href}`,
          '_blank'
        )
        break
    }
  }
}

export function formatDateISO(date: string) {
  console.log('date')
  return new Date(date).toString('yyyy-mm-ddThh:mm:ss:zzz')
}
