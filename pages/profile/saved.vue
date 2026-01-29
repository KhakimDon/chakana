<template>
  <main>
    <CommonBack v-if="useMobile('mobile')" to="/profile" />
    <div class="flex-center-between mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('saved') || 'Избранное' }}
      </h1>
      <span v-if="savedProducts.length > 0" class="text-sm text-gray-100">
        {{ savedProducts.length }} {{ $t('products') || 'товаров' }}
      </span>
    </div>
    
    <section class="w-full">
      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <MainCardLoading v-for="key in 8" :key="key" />
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="flex-center flex-col gap-3 py-12 md:py-20">
        <CommonNoData
          class="w-full"
          image="/images/no-data/nf.svg"
          title="error_occurred"
          :subtitle="error"
        />
        <BaseButton
          class="w-fit py-2 px-7"
          :text="$t('retry') || 'Повторить'"
          @click="fetchSaved"
        />
      </div>
      
      <!-- Products grid -->
      <div
        v-else-if="savedProducts.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        <MainCard 
          v-for="product in savedProducts" 
          :key="product.id" 
          :card="product"
        />
      </div>
      
      <!-- Empty state -->
      <div v-else class="flex-center flex-col gap-3 py-12 md:py-20">
        <CommonNoData
          class="w-full"
          image="/images/no-data/nf.svg"
          title="saved_empty_title"
          subtitle="saved_empty_subtitle"
        />
        <NuxtLinkLocale to="/">
          <BaseButton
            class="w-fit py-2 px-7"
            :text="$t('go_shopping') || 'Перейти к покупкам'"
          />
        </NuxtLinkLocale>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { useSavedStore } from '~/store/saved'

const authStore = useAuthStore()
const savedStore = useSavedStore()
const localePath = useLocalePath()

const loading = computed(() => savedStore.loading)
const savedProducts = computed(() => savedStore.products)
const error = computed(() => savedStore.error)

// Fetch saved products
const fetchSaved = async () => {
  // Only fetch if user is authenticated
  if (!authStore.isAuthorized) {
    return
  }
  
  try {
    await savedStore.fetchSavedProducts()
  } catch (err) {
    console.error('Error fetching saved products:', err)
  }
}

// Redirect to login if not authenticated
onMounted(() => {
  if (!authStore.isAuthorized) {
    // Show auth modal instead of redirecting
    authStore.showAuth = true
    navigateTo(localePath('/profile'))
    return
  }
  
  fetchSaved()
})

// SEO
useHead({
  title: 'Избранное — Chakana',
})
</script>
