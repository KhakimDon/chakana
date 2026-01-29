<template>
  <div
    class="relative flex flex-col bg-[#F2F2F2] rounded-xl cursor-pointer group"
    :class="{ 'opacity-60': !store.is_open_now }"
    @click="navigateToStore"
  >
    <!-- Изображение магазина -->
    <div class="relative w-full h-[160px] overflow-hidden rounded-[16px]">
      <img
        :src="store.store_image || store.seller_logo || '/images/default/placeholder.png'"
        :alt="store.seller_name"
        class="w-full h-full object-cover group-hover:scale-105 transition-300"
      />
    </div>
    <!-- Badge "Закрыто" -->
    <div
      v-if="!store.is_open_now"
      class="absolute -translate-y-1/2 top-0 right-3 px-3 py-1 rounded-[12px] text-sm font-bold bg-[#2D2D2D] text-white"
    >
      {{ $t('closed') || 'Закрыто' }}
    </div>

    <!-- Информация о магазине -->
    <div class="flex items-center  p-4 gap-3">
      <!-- Логотип продавца -->
      <div class="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
        <img
          :src="store.seller_logo || '/images/default/placeholder.png'"
          :alt="store.seller_name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Название и инфо -->
      <div class="flex flex-col min-w-0 flex-1">
        <h3 class="text-sm font-semibold text-dark line-clamp-1">
          {{ store.seller_name }}
        </h3>
        <div class="flex items-center gap-3 mt-0.5">
          <!-- Время работы -->
          <div class="flex items-center gap-1 text-xs text-gray-500">
            <IconClock class="w-3.5 h-3.5 shrink-0" />
            <span>{{ store.operating_hours || '08:00 - 22:00' }}</span>
          </div>
          <!-- Расстояние или время доставки -->
          <div class="flex items-center gap-1 text-xs text-gray-500">
            <IconLocation class="w-3.5 h-3.5 shrink-0" />
            <span>{{ store.distance || store.delivery_time_formatted || '150 м.' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconClock from '~/assets/icons/Common/clock.svg'
import IconLocation from '~/assets/icons/Common/location.svg'

interface Store {
  id: number
  seller_id?: number
  seller_name: string
  seller_category?: string
  seller_category_id?: number
  store_name: string
  address?: string
  seller_logo?: string
  store_image?: string
  distance?: string
  distance_meters?: number
  delivery_fee?: string
  estimated_delivery_time?: number
  delivery_time_formatted?: string
  operating_hours?: string
  is_open_now: boolean
  is_open: boolean
}

interface Props {
  store: Store
}

const props = defineProps<Props>()
const localePath = useLocalePath()

const navigateToStore = () => {
  // Используем seller_id для загрузки товаров магазина (store_id параметр в API)
  const storeId = props.store.seller_id || props.store.id
  navigateTo(localePath(`/store/${storeId}`))
}
</script>
