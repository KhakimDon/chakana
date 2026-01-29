<template>
  <section class="mb-24 space-y-6">
    <!-- Back Button -->
    <div
      class="flex items-center gap-1 text-gray-100 cursor-pointer group mb-4"
      @click="router.back()"
    >
      <IconChevron
        class="cursor-pointer text-gray-100 group-hover:-translate-x-1 transition-300 group-hover:text-orange"
      />
      <p class="text-gray-100 group-hover:text-orange transition-300">
        {{ $t('go_back') || 'Вернуться назад' }}
      </p>
    </div>

    <!-- Title -->
    <h1 class="text-[22px] md:text-[28px] font-bold leading-130 text-dark mb-6">
      {{ $t('saved') || 'Избранные' }}
    </h1>

    <!-- Products Grid -->
    <Transition name="fade" mode="out-in">
      <div
        :key="loading?.list"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10"
      >
        <template v-if="loading.list">
          <MainCardLoading v-for="key in 16" :key="key" />
        </template>
        <template v-else-if="mappedList?.length">
          <MainCard v-for="(card, index) in mappedList" :key="index" :card="card" />
        </template>
        <template v-else>
          <CommonNoData class="col-span-4" :title="$t('saved_empty_title') || 'Нет избранных товаров'" />
        </template>
      </div>
    </Transition>
    
    <!-- Infinite Scroll Trigger -->
    <div
      v-if="!loading?.list && !loading?.button && paginationData?.next"
      ref="infiniteScrollTrigger"
    />
  </section>
</template>
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

import IconChevron from '~/assets/icons/Common/chevron.svg'
import type { IProduct } from '~/types/products.js'

const router = useRouter()

definePageMeta({
  middleware: ['auth'],
})

const { list, loading, loadMore, paginationData } = useListFetcher<IProduct>(
  `/products/list/`,
  5,
  true,
  '',
  { saved_only: true }
)

// Map API response to IProduct format
const mapProduct = (p: any): IProduct => {
  // Get first image from product_images array
  const mainImage = p.product_images?.[0]?.image || p.product_images?.[0]?.image_1024 || p.main_image || ''
  const thumbnails = p.product_images?.[0] || {}
  
  // Parse uom (e.g. "2,5 kg" -> amount: 2.5, uom: "kg")
  const uomMatch = p.uom?.match(/^([\d.,]+)\s*(.+)$/)
  const uomAmount = uomMatch ? parseFloat(uomMatch[1].replace(',', '.')) : (p.product_uom_amount || null)
  const uomUnit = uomMatch ? uomMatch[2] : (p.product_uom || p.uom)
  
  // Get price from main_offer or direct fields
  let price = 0
  let discountPrice = null
  let discountPercentage = null
  let hasDiscount = false

  const mainOffer = p.main_offer
  if (mainOffer) {
    // New API format with main_offer
    const originalPrice = parseFloat(mainOffer.price) || 0
    const salePrice = mainOffer.sale_price ? parseFloat(mainOffer.sale_price) : null
    hasDiscount = mainOffer.has_discount === true && salePrice !== null
    
    if (hasDiscount && salePrice) {
      price = originalPrice
      discountPrice = salePrice
      discountPercentage = mainOffer.discount_percentage || Math.round((1 - salePrice / originalPrice) * 100)
    } else {
      price = parseFloat(mainOffer.final_price) || originalPrice
    }
  } else {
    // Legacy format from /products/list/
    price = p.min_price || p.max_price || p.base_price || p.price || 0
    hasDiscount = p.has_discount === true
    discountPrice =
      hasDiscount && p.max_price && p.min_price && p.max_price > p.min_price
        ? p.min_price
        : p.discount_price || null
    const originalPrice = hasDiscount && p.max_price ? p.max_price : price

    discountPercentage = p.discount_percentage || null
    if (hasDiscount && originalPrice && discountPrice && !discountPercentage) {
      discountPercentage = Math.round((1 - discountPrice / originalPrice) * 100)
    }
    
    price = originalPrice
  }

  // Check stock
  const totalAvailability = p.total_availability
  const inStock = totalAvailability?.in_stock !== false && 
    (p.available_stores_count > 0 || totalAvailability?.total_quantity > 0)
  const maxQuantity = inStock
    ? (totalAvailability?.total_quantity || p.max_quantity || 100)
    : 0

  // Collect all product images - always preserve product_images array if it exists
  let productImagesArray = undefined
  if (p.product_images && Array.isArray(p.product_images) && p.product_images.length > 0) {
    // Keep original product_images array structure
    productImagesArray = p.product_images
  }

  return {
    id: p.id,
    name: p.product_title || p.name || p.title || '',
    price: price,
    weight: 0,
    weight_measure: '',
    litre: 0,
    litre_measure: '',
    main_image: mainImage,
    discount_price: discountPrice,
    discount_percentage: discountPercentage,
    discount_type: hasDiscount ? 'percentage' : '',
    quantity: maxQuantity,
    max_quantity: maxQuantity,
    out_of_stock: !inStock,
    product_uom_amount: uomAmount ?? 0,
    product_uom: (uomUnit || null) as string | null,
    thumbnails: {
      image_256: thumbnails.image_256 || mainImage,
      image_512: thumbnails.image_512 || mainImage,
      image_1024: thumbnails.image_1024 || mainImage,
    },
    // Always pass product_images if it exists (for slider detection)
    product_images: productImagesArray,
  }
}

// Map list items to IProduct format
const mappedList = computed(() => {
  if (!list.value || !Array.isArray(list.value)) return []
  return list.value.map(mapProduct)
})

const infiniteScrollTrigger = ref<HTMLElement | null>(null)

useIntersectionObserver(infiniteScrollTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting && !loading.list) {
    loadMore()
  }
})
</script>
<style scoped></style>
