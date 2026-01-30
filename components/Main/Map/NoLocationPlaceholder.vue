<template>
  <div class="flex flex-col items-center justify-center py-3 px-3">
    <!-- Иконка локации -->
    <div class="mb-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="126" height="124" viewBox="0 0 126 124" fill="none">
        <path d="M84.8863 50.2924C75.9336 50.2924 66.8421 49.9269 58.3274 47.5402C49.973 45.2073 42.3023 40.6812 35.4649 35.4455C30.9778 32.0375 26.9181 29.3175 21.0957 29.7261C15.4092 30.0434 9.97471 32.1917 5.59406 35.8541C-1.80954 42.3691 -0.687782 54.4207 2.26084 62.8924C6.71582 75.6536 20.2303 84.523 31.7364 90.2962C45.0158 96.9725 59.5987 100.821 74.235 103.079C87.0551 105.046 103.518 106.465 114.629 98.0476C124.842 90.307 127.641 72.6219 125.141 60.6885C124.531 57.1619 122.662 53.981 119.885 51.7438C112.717 46.4651 102.023 49.9914 93.9672 50.1634C90.9759 50.2924 87.9418 50.2924 84.8863 50.2924Z" fill="#C7C7C7" fill-opacity="0.2"/>
        <path d="M62.9961 124C84.6561 124 102.215 122.898 102.215 121.538C102.215 120.178 84.6561 119.076 62.9961 119.076C41.3362 119.076 23.7773 120.178 23.7773 121.538C23.7773 122.898 41.3362 124 62.9961 124Z" fill="#E3E8EC"/>
        <path d="M83.0916 0.5C83.3907 0.5 83.6384 0.745008 83.6384 1.05371C83.6384 1.36235 83.3906 1.60742 83.0916 1.60742C82.7925 1.60737 82.5447 1.36232 82.5447 1.05371C82.5447 0.745036 82.7925 0.500052 83.0916 0.5Z" fill="#E3E8EC" stroke="#E3E8EC"/>
        <path d="M35.2406 102.751C35.5397 102.751 35.7875 102.996 35.7875 103.305C35.7874 103.613 35.5397 103.859 35.2406 103.859C34.9416 103.858 34.6938 103.613 34.6937 103.305C34.6937 102.996 34.9415 102.751 35.2406 102.751Z" fill="#E3E8EC" stroke="#E3E8EC"/>
        <path d="M95.4308 109.744V114.367" stroke="#E3E8EC" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M93.1233 112.056H97.7278" stroke="#E3E8EC" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M61.3081 6.08502C49.9744 6.08502 39.105 10.6157 31.0909 18.6804C23.0767 26.7451 18.5745 37.6831 18.5745 49.0883C18.5745 80.6527 61.3081 110.207 61.3081 110.207C61.3081 110.207 104.042 81.1043 104.042 49.0883C104.042 37.6831 99.5395 26.7451 91.5254 18.6804C83.5112 10.6157 72.6418 6.08502 61.3081 6.08502ZM61.3081 65.2145C57.9799 65.2145 54.7263 64.2219 51.9584 62.362C49.1905 60.5022 47.0324 57.8585 45.7568 54.7651C44.4812 51.6716 44.1453 48.2671 44.7915 44.9816C45.4377 41.6961 47.037 38.677 49.3875 36.3057C51.7379 33.9345 54.734 32.3174 57.9972 31.6588C61.2605 31.0002 64.6445 31.3296 67.7218 32.6054C70.7991 33.8812 73.4316 36.0462 75.2868 38.8268C77.1421 41.6074 78.1367 44.879 78.1452 48.2282C78.1423 52.721 76.3675 57.029 73.2106 60.2058C70.0536 63.3827 65.7727 65.1687 61.3081 65.1715V65.2145Z" fill="#C8C8C8"/>
        <path d="M16.0958 14.0513V18.6742" stroke="#E3E8EC" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.7883 16.3628H18.3929" stroke="#E3E8EC" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M111.734 26.6298V31.2527" stroke="#E3E8EC" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M109.426 28.9413H114.031" stroke="#E3E8EC" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Заголовок -->
    <h3 class="text-base font-bold text-dark mb-2 text-center leading-130">
      {{ $t('address_not_added') || 'Адрес не добавлен' }}
    </h3>

    <!-- Описание -->
    <p class="text-sm text-gray-500 text-center mb-5 leading-130 px-2">
      {{
        $t('specify_location_to_display_stores') ||
        'Укажите местоположение, чтобы отобразить доступные точки на карте!'
      }}
    </p>

    <!-- Кнопка добавления -->
    <BaseButton
      :text="$t('add_address') || 'Добавьте адрес'"
      class="w-full"
      variant="primary"
      @click="handleAddClick"
    >
      <template #prefix>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="text-white"
        >
          <path
            d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
            fill="currentColor"
          />
        </svg>
      </template>
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

interface Emits {
  (e: 'add-location'): void
}

const emit = defineEmits<Emits>()
const authStore = useAuthStore()

const handleAddClick = () => {
  // Неавторизованным показываем модалку входа
  if (!authStore.isAuthorized) {
    authStore.showAuth = true
    return
  }

  // Авторизованным открываем модалку добавления адреса
  emit('add-location')
}
</script>
