import { formatDateISO } from '@/utils/index'
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

export default defineSitemapEventHandler(async () => {
  const companies = await $fetch<ReturnType<typeof asSitemapUrl>>(
    `${
      useRuntimeConfig().public.baseURL
    }review/api/v1/front_office/SiteMapObjectsCatalog/company/`
  )

  return companies?.data.map(
    (company: { slug: string; updated_at: string }) => {
      return {
        loc: '/' + company.slug,
        lastmod: formatDateISO(company?.updated_at),
        priority: 0.8,
      }
    }
  )
})
