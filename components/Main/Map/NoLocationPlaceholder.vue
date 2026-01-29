<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <!-- Иконка локации -->
    <div class="mb-6">
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="text-gray-400"
      >
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
          fill="currentColor"
        />
      </svg>
    </div>

    <!-- Заголовок -->
    <h3 class="text-lg font-bold text-dark mb-2 text-center">
      {{ $t('address_not_added') || 'Адрес не добавлен' }}
    </h3>

    <!-- Описание -->
    <p class="text-sm text-gray-500 text-center max-w-[300px] mb-6">
      {{
        $t('specify_location_to_display_stores') ||
        'Укажите местоположение, чтобы отобразить доступные точки на карте!'
      }}
    </p>

    <!-- Кнопка добавления -->
    <BaseButton
      :text="$t('add_address') || '+ Добавьте адрес'"
      class="w-full max-w-[280px]"
      variant="primary"
      @click="handleAddClick"
    >
      <template #prefix>
        <svg
          width="20"
          height="20"
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
  // Если пользователь не авторизован - показываем модалку входа
  if (!authStore.isAuthorized) {
    authStore.showAuth = true
    return
  }

  // Если авторизован - открываем модалку добавления локации
  emit('add-location')
}
</script>
