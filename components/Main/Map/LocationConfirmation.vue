<template>
  <div>
    <!-- Заголовок -->
    <p class="text-xs leading-130 font-medium text-dark">
      {{ $t('your_location') || 'Ваш местоположение:' }}
    </p>
    
    <!-- Адрес локации -->
    <p class="mt-0.5 text-sm leading-130 font-bold text-dark mb-4">
      {{ locationTitle }}
    </p>

    <!-- Карта -->
    <div class="relative overflow-hidden rounded-xl">
      <MainMap
        v-if="mapCoordinates.length"
        :key="mapCoordinates"
        :center="mapCoordinates"
        no-actions
        class="w-full h-[150px]"
      />
      <div v-else class="w-full h-[150px] bg-gray-200 rounded-xl flex items-center justify-center">
        <p class="text-sm text-gray-500">{{ $t('loading') || 'Загрузка...' }}</p>
      </div>
    </div>

    <!-- Кнопки подтверждения -->
    <div class="flex-y-center gap-3 mt-4">
      <BaseButton
        class="flex-1"
        :text="$t('yes_correct') || 'Да верно'"
        variant="primary"
        :loading="activating"
        @click="handleConfirm"
      />
      <BaseButton
        class="flex-1"
        :text="$t('no_another') || 'Нет другой'"
        variant="secondary"
        @click="handleSelectAnother"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserLocation } from '~/types/locations'
import { useLocationsStore } from '~/store/locations'
import { useMainStore } from '~/store/main'
import { useCategoriesStore } from '~/store/categories'

interface Props {
  location: UserLocation
}

interface Emits {
  (e: 'confirmed'): void
  (e: 'select-another'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const locationsStore = useLocationsStore()
const mainStore = useMainStore()
const categoriesStore = useCategoriesStore()

const activating = ref(false)

const locationTitle = computed(() => {
  return props.location.title || props.location.address || ''
})

const mapCoordinates = computed(() => {
  if (props.location) {
    return [
      parseFloat(props.location.longitude),
      parseFloat(props.location.latitude),
    ]
  }
  return []
})

// Подтверждение локации (активация)
const handleConfirm = async () => {
  if (activating.value) return
  
  activating.value = true
  try {
    // Активируем локацию
    await locationsStore.activateLocation(props.location.id)
    
    // Обновляем список магазинов
    await mainStore.fetchNearbyStores()
    
    // Обновляем категории в сайдбаре
    await categoriesStore.fetchCategories()
    
    // Эмитим событие подтверждения
    emit('confirmed')
  } catch (error) {
    console.error('[LocationConfirmation] Error activating location:', error)
  } finally {
    activating.value = false
  }
}

// Выбор другой локации
const handleSelectAnother = () => {
  emit('select-another')
}
</script>
