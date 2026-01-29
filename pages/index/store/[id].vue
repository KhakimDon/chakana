<template>
  <div>
    <!-- Search -->
    <div class="w-full flex-y-center gap-2 mb-6">
      <FormInputSearch 
        v-model="searchQuery"
        :placeholder="$t('search')" 
        class="w-full !h-10"
        @input="debouncedSearch"
      />
      <button 
        class="w-10 h-10 rounded-lg bg-white-100 flex-center shrink-0 hover:bg-blue-100/10 transition-300"
      >
        <IconList class="text-2xl text-blue-100" />
      </button>
    </div>

    <!-- Top Products -->
    <div v-if="topProducts.length > 0 && !selectedCategoryId && !searchQuery" class="mb-8">
      <h2 class="text-xl font-bold text-dark mb-4">{{ $t('top_products') || 'Топ товары' }}</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <MainCard
          v-for="product in topProducts"
          :key="product.id"
          :card="product"
        />
      </div>
    </div>

    <!-- All Products -->
    <div>
      <h2 class="text-xl font-bold text-dark mb-4">
        {{ selectedCategoryId || searchQuery ? ($t('products') || 'Товары') : ($t('all_products') || 'Все продукты') }}
      </h2>
      
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <MainCardLoading v-for="i in 8" :key="i" />
      </div>
      <div 
        v-else-if="products.length > 0" 
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <MainCard
          v-for="product in products"
          :key="product.id"
          :card="product"
        />
      </div>
      <div v-else class="flex flex-col items-center justify-center py-12">
        <img src="/images/no-data/nf.svg" alt="No data" class="w-32 h-32 mb-4" />
        <p class="text-lg font-bold text-dark mb-2">{{ $t('products_not_found') || 'Товары не найдены' }}</p>
        <p class="text-sm text-gray-100 text-center">
          {{ $t('no_products_in_category') || 'В данной категории пока нет товаров' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'
import IconList from '~/assets/icons/Common/list.svg'
import { useStorePageStore } from '~/store/storePage'

const route = useRoute()
const storeId = computed(() => route.params.id)

const storePageStore = useStorePageStore()

// State
const products = ref<any[]>([])
const topProducts = ref<any[]>([])
const loading = ref(true)
const selectedCategoryId = ref<number | null>(null)
const searchQuery = ref('')

// Fetch store info
const fetchStore = async () => {
  try {
    const res = await useChakanaApi().$get('/stores/nearby/')
    const stores = Array.isArray(res) ? res : []
    const store = stores.find((s: any) => s.id == storeId.value || s.seller_id == storeId.value)
    
    // Save store info to shared store
    storePageStore.setStore(store)
  } catch (error) {
    console.error('Error fetching store:', error)
  }
}

// Fetch categories for sidebar
const fetchCategories = async () => {
  storePageStore.setCategoriesLoading(true)
  try {
    const res = await useChakanaApi().$get('/categories/')
    const categories = Array.isArray(res) ? res : (res?.results || [])
    storePageStore.setCategories(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    storePageStore.setCategoriesLoading(false)
  }
}

// Map API product to IProduct format
const mapProduct = (p: any) => {
  // Get first image from product_images array
  const mainImage = p.product_images?.[0]?.image || p.main_image || ''
  const thumbnails = p.product_images?.[0] || {}
  
  // Parse uom (e.g. "197 g" -> amount: 197, uom: "g")
  const uomMatch = p.uom?.match(/^([\d.]+)\s*(.+)$/)
  const uomAmount = uomMatch ? parseFloat(uomMatch[1]) : null
  const uomUnit = uomMatch ? uomMatch[2] : p.uom
  
  // Get price - prefer min_price, then max_price, then base_price
  const price = p.min_price || p.max_price || p.base_price || p.price || 0
  
  // Calculate discount
  const hasDiscount = p.has_discount === true
  const discountPrice = hasDiscount && p.max_price && p.min_price && p.max_price > p.min_price 
    ? p.min_price 
    : (p.discount_price || null)
  const originalPrice = hasDiscount && p.max_price ? p.max_price : price
  
  // Calculate discount percentage if has discount
  let discountPercentage = p.discount_percentage || null
  if (hasDiscount && originalPrice && discountPrice && !discountPercentage) {
    discountPercentage = Math.round((1 - discountPrice / originalPrice) * 100)
  }
  
  // Check stock
  const inStock = p.total_availability?.in_stock !== false && p.available_stores_count > 0
  const maxQuantity = inStock ? (p.total_availability?.total_quantity || p.max_quantity || 100) : 0
  
  return {
    id: p.id,
    name: p.product_title || p.name || '',
    price: originalPrice,
    discount_price: discountPrice,
    discount_type: hasDiscount ? 'percentage' : null,
    discount_percentage: discountPercentage,
    main_image: mainImage,
    thumbnails: {
      image_256: thumbnails.image_256 || mainImage,
      image_512: thumbnails.image_512 || mainImage,
      image_1024: thumbnails.image_1024 || mainImage,
    },
    max_quantity: maxQuantity,
    out_of_stock: !inStock,
    product_uom_amount: uomAmount,
    product_uom: uomUnit,
    is_top: p.is_top || false,
    category: p.category,
    // Always pass product_images if it exists (for slider detection)
    product_images: (p.product_images && Array.isArray(p.product_images) && p.product_images.length > 0) 
      ? p.product_images 
      : undefined,
  }
}

// Fetch products
const fetchProducts = async (categoryId?: number | null, search?: string) => {
  loading.value = true
  try {
    let params = `?store_id=${storeId.value}`
    if (categoryId) {
      params += `&category_id=${categoryId}`
    }
    if (search) {
      params += `&search=${encodeURIComponent(search)}`
    }
    
    const res: any = await useChakanaApi().$get(`/products/list/${params}`)
    
    let productList = []
    if (Array.isArray(res)) {
      productList = res
    } else if (res?.results && Array.isArray(res.results)) {
      productList = res.results
    } else if (res?.data && Array.isArray(res.data)) {
      productList = res.data
    }
    
    products.value = productList.map(mapProduct)
  } catch (error) {
    console.error('Error fetching products:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

// Fetch top products
const fetchTopProducts = async () => {
  try {
    const res: any = await useChakanaApi().$get(`/products/list/?store_id=${storeId.value}&is_top=true&limit=8`)
    
    let productList = []
    if (Array.isArray(res)) {
      productList = res
    } else if (res?.results && Array.isArray(res.results)) {
      productList = res.results
    } else if (res?.data && Array.isArray(res.data)) {
      productList = res.data
    }
    
    topProducts.value = productList.map(mapProduct)
  } catch (error) {
    console.error('Error fetching top products:', error)
  }
}

// Select category (called from sidebar via store)
watch(() => storePageStore.selectedCategoryId, (newCategoryId) => {
  selectedCategoryId.value = newCategoryId
  fetchProducts(newCategoryId, searchQuery.value)
})

// Debounced search
let searchTimeout: any = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchProducts(selectedCategoryId.value, searchQuery.value)
  }, 300)
}

// Initialize
onMounted(async () => {
  storePageStore.setIsStorePage(true)
  await Promise.all([
    fetchStore(),
    fetchCategories(),
    fetchProducts(),
    fetchTopProducts()
  ])
})

// Reset only when navigating away from store context (not to product page)
onBeforeRouteLeave((to, from, next) => {
  // Keep store sidebar when navigating to product page
  const isNavigatingToProduct = to.path.includes('/product/')
  if (!isNavigatingToProduct) {
    storePageStore.reset()
  }
  next()
})

useHead({
  title: computed(() => storePageStore.store?.seller_name ? `${storePageStore.store.seller_name} — Chakana` : 'Магазин — Chakana')
})
</script>
