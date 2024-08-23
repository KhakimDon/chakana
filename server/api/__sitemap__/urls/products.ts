import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import { formatDateISO } from '~/utils/functions/common'

export default defineSitemapEventHandler(async () => {
  const products = await $fetch<ReturnType<typeof asSitemapUrl>>(
    `https://web.xolodilnikgo.uz/fastapi/product/list/for/sitemap`
  )

  return products.map((product: { slug: string; write_date: string }) => {
    return {
      loc: '/' + product.slug,
      lastmod: formatDateISO(product?.write_date),
      priority: 0.8,
    }
  })
})
