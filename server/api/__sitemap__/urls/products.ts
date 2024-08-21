import { formatDateISO } from '@/utils/functions/common'
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

export default defineSitemapEventHandler(async () => {
  console.log('working sitemap')
  const products = await $fetch<ReturnType<typeof asSitemapUrl>>(
    `https://xolodilnik-erp.uicgroup.tech/fastapi/new/products?page=1&page_size=20`
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
