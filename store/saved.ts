import { defineStore } from 'pinia'

interface SavedProduct {
  id: number
  name: string
  price: number
  discount_price?: number
  main_image: string
  saved: boolean
  [key: string]: any
}

export const useSavedStore = defineStore('savedStore', {
  state: () => ({
    products: [] as SavedProduct[],
    loading: false,
    error: null as string | null,
    // Local cache of saved product IDs for instant UI feedback
    savedProductIds: new Set<number>(),
  }),

  getters: {
    isProductSaved: (state) => (productId: number) => {
      return state.savedProductIds.has(productId)
    },
    savedCount: (state) => state.savedProductIds.size,
  },

  actions: {
    /**
     * Fetch saved products from API
     * GET /products/list/?saved_only=true
     */
    async fetchSavedProducts() {
      this.loading = true
      this.error = null

      try {
        // Use useApi for authenticated request
        const res: any = await useApi().$get('/products/list/', {
          query: { saved_only: true }
        })

        let productList = []
        if (Array.isArray(res)) {
          productList = res
        } else if (res?.results && Array.isArray(res.results)) {
          productList = res.results
        }

        // Map products to our format
        this.products = productList.map((p: any) => this.mapProduct(p))
        
        // Update saved IDs set
        this.savedProductIds = new Set(this.products.map(p => p.id))
        return this.products
      } catch (err: any) {
        console.error('Error fetching saved products:', err)
        this.error = err?.message || 'Failed to fetch saved products'
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Toggle product saved status
     * Uses POST /saved-products/add/ and DELETE /saved-products/remove/{sku_id}/
     * @param productId - Product ID to toggle
     * @param currentSavedState - Optional: current saved state from component (to override store check)
     * Returns: { success: boolean, isSaved: boolean, wasSaved: boolean }
     */
    async toggleSaved(productId: number, currentSavedState?: boolean): Promise<{ success: boolean; isSaved: boolean; wasSaved: boolean }> {
      // Use currentSavedState if provided, otherwise check store
      const wasSaved = currentSavedState !== undefined ? currentSavedState : this.savedProductIds.has(productId)

      // Optimistic update
      if (wasSaved) {
        this.savedProductIds.delete(productId)
        this.products = this.products.filter(p => p.id !== productId)
      } else {
        this.savedProductIds.add(productId)
      }

      try {
        if (wasSaved) {
          // Remove from saved: DELETE /saved-products/remove/{sku_id}/
          // API returns 204 No Content on success
          await useApi().$delete(`/saved-products/remove/${productId}/`)
          // If we got here without error, it's success (204 is handled in $delete)
          return { success: true, isSaved: false, wasSaved: true }
        } else {
          // Add to saved: POST /saved-products/add/
          await useApi().$post('/saved-products/add/', {
            body: {
              sku: productId,
            },
          })
          // If we got here without error, it's success (200/201/204 is handled in $post)
          return { success: true, isSaved: true, wasSaved: false }
        }
      } catch (err: any) {
        // This catch should only trigger for REAL errors now, since $delete/$post handle 204/200/201
        // But just in case, double-check status
        const status = err?.status || err?.statusCode || err?.response?.status
        const isSuccessStatus = status === 200 || status === 201 || status === 204
        
        if (isSuccessStatus) {
          // It's a success response, return success (shouldn't happen, but just in case)
          console.warn('Success status caught in catch block, this should not happen:', status)
          return { 
            success: true, 
            isSaved: !wasSaved, 
            wasSaved 
          }
        }
        
        // Revert optimistic update on real error
        if (wasSaved) {
          this.savedProductIds.add(productId)
        } else {
          this.savedProductIds.delete(productId)
        }
        console.error('Error toggling saved status:', err)
        return { success: false, isSaved: wasSaved, wasSaved }
      }
    },

    /**
     * Add product to saved list
     * POST /saved-products/add/
     */
    async addProductToSaved(productId: number): Promise<boolean> {
      if (this.savedProductIds.has(productId)) {
        return true // Already saved
      }

      // Optimistic update
      this.savedProductIds.add(productId)

      try {
        await useApi().$post('/saved-products/add/', {
          body: {
            sku: productId,
          },
        })
        return true
      } catch (err: any) {
        // Revert optimistic update
        this.savedProductIds.delete(productId)
        console.error('Error adding to saved:', err)
        throw err
      }
    },

    /**
     * Remove product from saved list
     * DELETE /saved-products/remove/{sku_id}/
     */
    async removeProductFromSaved(productId: number): Promise<boolean> {
      if (!this.savedProductIds.has(productId)) {
        return true // Already not saved
      }

      // Optimistic update
      this.savedProductIds.delete(productId)
      this.products = this.products.filter(p => p.id !== productId)

      try {
        await useApi().$delete(`/saved-products/remove/${productId}/`)
        return true
      } catch (err: any) {
        // Revert optimistic update
        this.savedProductIds.add(productId)
        console.error('Error removing from saved:', err)
        throw err
      }
    },

    // Add product to local cache (used when we have full product data)
    addToLocalCache(product: any) {
      const mapped = this.mapProduct(product)
      if (!this.savedProductIds.has(mapped.id)) {
        this.savedProductIds.add(mapped.id)
        this.products.push(mapped)
      }
    },

    // Remove product from local cache
    removeFromLocalCache(productId: number) {
      this.savedProductIds.delete(productId)
      this.products = this.products.filter(p => p.id !== productId)
    },

    // Check if product is saved (from local cache)
    checkSaved(productId: number): boolean {
      return this.savedProductIds.has(productId)
    },

    // Map API product to our format
    mapProduct(p: any): SavedProduct {
      // Handle images from various API response formats
      const productImages = p.product_images || p.sku_images || p.images || []
      // Get first image from product_images array
      const mainImage = productImages?.[0]?.image || productImages?.[0]?.image_1024 || p.main_image || p.image || ''
      const thumbnails = productImages?.[0] || {}
      
      // Parse uom (e.g. "2,5 kg" -> amount: 2.5, uom: "kg")
      const uomMatch = p.uom?.match(/^([\d.,]+)\s*(.+)$/)
      const uomAmount = uomMatch ? parseFloat(uomMatch[1].replace(',', '.')) : (p.product_uom_amount || null)
      const uomUnit = uomMatch ? uomMatch[2] : (p.product_uom || p.uom)
      
      // Handle pricing from main_offer or direct fields
      const mainOffer = p.main_offer
      let price = 0
      let discountPrice = null
      let discountPercentage = null
      let hasDiscount = false

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
        // Legacy format
        price = p.min_price || p.max_price || p.base_price || p.price || 0
        hasDiscount = p.has_discount === true
        discountPrice = hasDiscount && p.max_price && p.min_price && p.max_price > p.min_price
          ? p.min_price
          : p.discount_price || null
        const originalPrice = hasDiscount && p.max_price ? p.max_price : price

        discountPercentage = p.discount_percentage || null
        if (hasDiscount && originalPrice && discountPrice && !discountPercentage) {
          discountPercentage = Math.round((1 - discountPrice / originalPrice) * 100)
        }
        
        price = originalPrice
      }

      // Handle stock/quantity
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
        discount_price: discountPrice,
        discount_percentage: discountPercentage,
        discount_type: hasDiscount ? 'percentage' : '',
        main_image: mainImage,
        saved: true,
        is_saved: true,
        product_uom: (uomUnit || null) as string | null,
        product_uom_amount: uomAmount ?? 0,
        max_quantity: maxQuantity,
        quantity: maxQuantity,
        out_of_stock: !inStock,
        category: p.category,
        has_discount: hasDiscount,
        // Add fields required by MainCard component
        thumbnails: {
          image_256: thumbnails.image_256 || mainImage,
          image_512: thumbnails.image_512 || mainImage,
          image_1024: thumbnails.image_1024 || mainImage,
        },
        // Always pass product_images if it exists (for slider detection)
        product_images: productImagesArray,
        // Additional fields for compatibility
        weight: 0,
        weight_measure: '',
        litre: 0,
        litre_measure: '',
      }
    },

    // Clear all saved products (on logout)
    clearSaved() {
      this.products = []
      this.savedProductIds.clear()
      this.error = null
    },
  },
})
