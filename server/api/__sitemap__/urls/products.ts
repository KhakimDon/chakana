import { formatDateISO } from '@/utils/functions/common'
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

export default defineSitemapEventHandler(async () => {
  console.log('working sitemap')
  const products = await $fetch<ReturnType<typeof asSitemapUrl>>(
    `${
      useRuntimeConfig().public.baseURL
    }review/api/v1/front_office/SiteMapObjectsCatalog/company/`
  )

  return products?.data.items.map(
    (product: { slug: string; updated_at: string }) => {
      return {
        loc: '/' + product.slug,
        lastmod: formatDateISO(),
        priority: 0.8,
      }
    }
  )
})
