<template>
  <div class="p-4 pt-3 rounded-xl bg-gray-300 min-h-[200px]">
    <!-- Если пользователь не авторизован - показываем placeholder -->
    <NoLocationPlaceholder
      v-if="!isAuthorized"
      @add-location="showAddModal = true"
    />

    <!-- Если авторизован и загружается - показываем загрузку -->
    <div
      v-else-if="locationsLoading"
      class="flex flex-col items-center justify-center py-12 px-4"
    >
      <p class="text-sm text-gray-500">{{ $t('loading') || 'Загрузка...' }}</p>
    </div>

    <!-- Если авторизован, загрузка завершена, но нет локаций - показываем placeholder -->
    <NoLocationPlaceholder
      v-else-if="!hasLocations"
      @add-location="showAddModal = true"
    />

    <!-- Если авторизован, есть локации, но нет активной - показываем подтверждение первой локации -->
    <LocationConfirmation
      v-else-if="!activeLocation && firstLocation"
      :location="firstLocation"
      @confirmed="handleLocationConfirmed"
      @select-another="showAddModal = true"
    />

    <!-- Если есть активная локация - показываем карту с кнопкой изменения -->
    <template v-else-if="activeLocation">
      <p class="text-xs leading-130 font-medium text-dark">
        {{ $t('your_address') }}
      </p>
      <p class="mt-0.5 text-sm leading-130 font-bold text-dark mb-4">
        {{ activeLocationTitle }}
      </p>
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

      <div class="flex-y-center gap-3 mt-4">
        <BaseButton
          class="w-full"
          :text="$t('change_address') || 'Изменить адрес'"
          @click="handleChangeAddress"
        />
      </div>
    </template>

    <!-- Fallback: если ничего не подошло, показываем placeholder -->
    <NoLocationPlaceholder
      v-else
      @add-location="showAddModal = true"
    />

    <!-- Модалка выбора локации -->
    <SelectLocationModal
      v-model="showSelectModal"
      @location-selected="handleLocationSelected"
      @add-new="showAddModal = true"
    />

    <!-- Модалка добавления локации -->
    <AddLocationModal
      v-model="showAddModal"
      @location-added="handleLocationAdded"
    />
  </div>
</template>
<script setup lang="ts">
import NoLocationPlaceholder from '~/components/Main/Map/NoLocationPlaceholder.vue'
import LocationConfirmation from '~/components/Main/Map/LocationConfirmation.vue'
import AddLocationModal from '~/components/Main/Map/AddLocationModal.vue'
import SelectLocationModal from '~/components/Main/Map/SelectLocationModal.vue'
import { useLocationsStore } from '~/store/locations'
import { useAuthStore } from '~/store/auth.js'
import { useMainStore } from '~/store/main'

const { t } = useI18n()

const locationsStore = useLocationsStore()
const authStore = useAuthStore()
const mainStore = useMainStore()

const showAddModal = ref(false)
const showSelectModal = ref(false)

const isAuthorized = computed(() => authStore.isAuthorized)

const hasLocations = computed(() => locationsStore.hasLocations)

const locationsLoading = computed(() => locationsStore.locationsLoading)

const activeLocation = computed(() => locationsStore.getActiveLocation)

const firstLocation = computed(() => locationsStore.getFirstLocation)

const activeLocationTitle = computed(() => {
  if (activeLocation.value) {
    return activeLocation.value.title || activeLocation.value.address || ''
  }
  return ''
})

const mapCoordinates = computed(() => {
  if (activeLocation.value) {
    return [
      parseFloat(activeLocation.value.longitude),
      parseFloat(activeLocation.value.latitude),
    ]
  }
  return []
})

// Загружаем локации при монтировании если пользователь авторизован
onMounted(async () => {
  // Если пользователь авторизован - загружаем локации
  if (isAuthorized.value) {
    try {
      await locationsStore.fetchLocations()
    } catch (error) {
      console.error('[MainMapSidebar] Error fetching locations:', error)
    }
  }
})

// Отслеживаем изменения авторизации
watch(
  () => isAuthorized.value,
  async (authorized, wasAuthorized) => {
    // Загружаем только если пользователь только что авторизовался
    if (authorized && !wasAuthorized && !locationsStore.locations.length) {
      try {
        await locationsStore.fetchLocations()
      } catch (error) {
        console.error('Error fetching locations after auth:', error)
      }
    }
  }
)

// Обработка нажатия на "Изменить адрес"
const handleChangeAddress = () => {
  console.log('[MainMapSidebar] Change address clicked, opening SelectLocationModal')
  showSelectModal.value = true
}

// Обработка выбора локации
const handleLocationSelected = async () => {
  // Локация уже активирована в SelectLocationModal компоненте
  // Просто обновляем список локаций для синхронизации
  await locationsStore.fetchLocations()
  // Магазины и категории уже обновлены в SelectLocationModal
}

// Обработка добавления локации
const handleLocationAdded = async () => {
  // Обновляем список локаций
  await locationsStore.fetchLocations()
  // Обновляем список магазинов
  await mainStore.fetchNearbyStores()
}

// Обработка подтверждения локации
const handleLocationConfirmed = async () => {
  // Локация уже активирована в LocationConfirmation компоненте
  // Просто обновляем список локаций для синхронизации
  await locationsStore.fetchLocations()
  // Магазины уже обновлены в LocationConfirmation
}
</script>
