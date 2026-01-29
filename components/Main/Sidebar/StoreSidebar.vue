<template>
  <div class="w-full h-[calc(100vh-126px)] gap-1 relative overflow-hidden">
    <div class="h-[calc(100vh-150px)] overflow-y-auto relative scrollbar-hide">
      <!-- Store Header -->
      <div
        class="flex items-center gap-1 mb-3 group cursor-pointer"
        @click="handleBackClick"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711L10.4142 12L15.7071 17.2929C16.0976 17.6834 16.0976 18.3166 15.7071 18.7071C15.3166 19.0976 14.6834 19.0976 14.2929 18.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L14.2929 5.29289C14.6834 4.90237 15.3166 4.90237 15.7071 5.29289Z" fill="black"/>
        </svg>

        <div class="store-header flex p-1 rounded-[14px] flex-1 items-center gap-3">
          <div
            class="w-10 h-10 rounded-[100%] bg-white shrink-0 flex-center overflow-hidden"
          >
            <img
              v-if="store?.seller_logo"
              :src="store.seller_logo"
              :alt="store?.seller_name"
              class="w-10 h-10 object-contain"
              @error="handleLogoError"
            />
            <IconCart v-else class="size-10 text-[#C8C8C8]" />
          </div>
          <span class="text-black font-semibold text-sm truncate flex-1">
            {{ store?.seller_name || 'Магазин' }}
          </span>
        </div>
      </div>

      <!-- Categories -->
      <div class="flex flex-col gap-1.5">
        <!-- All button -->
        <div
          class="flex-y-center ml-[24px] gap-3 p-1.5 rounded-[12px] cursor-pointer group transition-300"
          :class="
            selectedCategoryId === null
              ? 'border border-orange'
              : 'border border-transparent'
          "
          @click="selectCategory(null)"
        >
          <div
            class="w-8 h-8 relative rounded-[6px] bg-[#F2F2F2] shrink-0 flex-center"
          >
            <IconAllCategories class="w-4 h-4 text-[#ED2024]" />
          </div>
          <p
            class="text-sm sm:text-xs leading-130 font-semibold transition-300 flex-1 min-w-0"
            :class="
              selectedCategoryId === null
                ? 'text-dark'
                : 'text-[#7C8A94] md:group-hover:text-orange'
            "
          >
            {{ $t('all') || 'Все' }}
          </p>
        </div>

        <!-- Category items -->
        <template v-if="!categoriesLoading">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex-y-center ml-[24px] relative gap-3 p-1.5 rounded-[12px] cursor-pointer group transition-300"
            :class="
              selectedCategoryId === category.id
                ? 'border border-orange'
                : 'border border-transparent'
            "
            @click="selectCategory(category.id)"
          >
            <div class="w-8 h-8 relative rounded-[6px] bg-[#F2F2F2] shrink-0">
              <nuxt-img
                v-if="category?.image || category?.icon || category?.icon_url"
                :src="category?.icon_url || category?.image || category?.icon"
                :alt="category?.name || category?.title"
                class="absolute object-contain transition-200 w-full h-full left-0 bottom-0"
                loading="lazy"
                @error="handleCategoryImageError"
              />
              <IconAllCategories
                v-else
                class="absolute w-4 h-4 text-gray-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <p
              class="text-sm sm:text-xs leading-130 font-semibold transition-300 flex-1 min-w-0"
              :class="
                selectedCategoryId === category.id
                  ? 'text-dark'
                  : 'text-[#7C8A94] md:group-hover:text-orange'
              "
            >
              {{ category?.name || category?.title }}
            </p>
          </div>
        </template>
        <template v-else>
          <MainSidebarItemLoading v-for="i in 9" :key="i" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconAllCategories from '~/assets/icons/Common/all-categories.svg'
import { useStorePageStore } from '~/store/storePage'
import IconCart from '~/assets/icons/Common/cart.svg'

const storePageStore = useStorePageStore()

const route = useRoute()
const localePath = useLocalePath()
const store = computed(() => storePageStore.store)
const categories = computed(() => storePageStore.categories)
const categoriesLoading = computed(() => storePageStore.categoriesLoading)
const selectedCategoryId = computed(() => storePageStore.selectedCategoryId)

// Проверяем, находимся ли мы на странице магазина
const isOnStorePage = computed(() => route.path.includes('/store/'))

// Обработчик клика на кнопку "назад"
const handleBackClick = () => {
  // Если мы на странице магазина - идём на главную
  if (isOnStorePage.value) {
    navigateTo(localePath('/'))
    return
  }
  
  // Если мы на странице продукта (пришли из магазина) - идём обратно в магазин
  const storeId = storePageStore.storeId || store.value?.id || store.value?.seller_id
  if (storeId) {
    navigateTo(localePath(`/store/${storeId}`))
  } else {
    navigateTo(localePath('/'))
  }
}

const selectCategory = (categoryId: number | null) => {
  storePageStore.selectCategory(categoryId)
}

const handleLogoError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = '/images/default/user.png'
}

const handleCategoryImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.store-header {
  background: linear-gradient(90deg, #fdedee 0%, #e6e9fe 100%);
}
</style>
