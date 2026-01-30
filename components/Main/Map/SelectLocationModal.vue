<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('select_address') || 'Выберите адрес'"
    body-class="!max-w-[868px] !w-full"
    disable-outer-close
    @update:model-value="emit('update:model-value', $event)"
  >
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 px-4">
      <p class="text-sm text-gray-500">{{ $t('loading') || 'Загрузка...' }}</p>
    </div>

    <div v-else-if="locations.length > 0">
      <p class="text-dark-100 text-sm font-medium leading-140 mb-4">
        {{ $t('select_existing_address') || 'Выберите один из сохраненных адресов или добавьте новый' }}
      </p>
      <div class="space-y-3 max-h-[400px] overflow-y-auto">
        <div
          v-for="location in locations"
          :key="location.id"
          class="p-4 border border-gray-200 rounded-xl transition-300 cursor-pointer relative"
          :class="{ 
            'border-orange bg-orange-50': selectedLocationId === location.id,
            'hover:border-gray-300': selectedLocationId !== location.id
          }"
          @click="selectedLocationId = location.id"
        >
          <!-- Radio button - справа сверху -->
          <div class="absolute top-4 right-4">
            <div
              class="w-5 h-5 rounded-full border-2 transition-300 flex items-center justify-center"
              :class="selectedLocationId === location.id 
                ? 'border-orange bg-orange' 
                : 'border-gray-300 bg-white'"
            >
              <div
                v-if="selectedLocationId === location.id"
                class="w-2.5 h-2.5 rounded-full bg-white"
              ></div>
            </div>
          </div>
          
          <!-- Location info -->
          <div class="pr-8">
            <div class="flex items-start gap-2">
              <div
                v-if="location.location_icon_data?.icon"
                class="shrink-0"
              >
                <img
                  :src="location.location_icon_data.icon"
                  :alt="location.title || 'Location'"
                  class="w-6 h-6"
                />
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-dark mb-1">
                  {{ location.title || location.address || 'Адрес' }}
                </p>
                <p class="text-xs text-dark-100 leading-130">
                  {{ location.address }}
                </p>
                <div v-if="location.apartment || location.entrance || location.floor" class="mt-2 text-xs text-dark-100">
                  <span v-if="location.apartment">Кв. {{ location.apartment }}</span>
                  <span v-if="location.entrance">, Подъезд {{ location.entrance }}</span>
                  <span v-if="location.floor">, Этаж {{ location.floor }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Delete button - снизу справа -->
          <div class="mt-4 flex justify-end">
            <button
              v-if="locations.length > 1"
              class="p-2 text-red hover:text-orange transition-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-red/10 flex items-center justify-center"
              :disabled="deletingLocationId === location.id || activating"
              @click.stop="handleDelete(location)"
              :title="$t('delete') || 'Удалить'"
            >
              <SvgoCommonTrash class="text-xl w-5 h-5 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="flex gap-3 mt-4">
        <BaseButton
          class="flex-1"
          :text="$t('add_new_address') || 'Добавить новый адрес'"
          variant="secondary"
          @click="handleAddNew"
        />
        <BaseButton
          class="flex-1"
          :text="$t('confirm') || 'Подтвердить'"
          :loading="activating"
          :disabled="!selectedLocationId"
          variant="primary"
          @click="handleConfirm"
        />
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12 px-4">
      <CommonNoData />
      <BaseButton
        class="w-full mt-4"
        :text="$t('add_address') || 'Добавить адрес'"
        variant="primary"
        @click="handleAddNew"
      />
    </div>

    <!-- Модалка подтверждения удаления -->
    <DeleteConfirm
      v-model="showDeleteConfirm"
      :loading="deletingLocationId !== null"
      :title="$t('delete') || 'Удалить'"
      @do-action="confirmDelete"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import type { UserLocation } from '~/types/locations'
import { useLocationsStore } from '~/store/locations'
import { useMainStore } from '~/store/main'
import { useCategoriesStore } from '~/store/categories'
import { useCustomToast } from '~/composables/useCustomToast'
import { useErrorHandling } from '~/composables/useErrorHandling'
import DeleteConfirm from '~/components/Common/Modal/DeleteConfirm.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

interface Emits {
  (e: 'update:model-value', value: boolean): void
  (e: 'location-selected'): void
  (e: 'add-new'): void
}

const emit = defineEmits<Emits>()

const { t } = useI18n()
const { showToast } = useCustomToast()
const { handleError } = useErrorHandling()

const locationsStore = useLocationsStore()
const mainStore = useMainStore()
const categoriesStore = useCategoriesStore()

const loading = ref(false)
const deletingLocationId = ref<number | string | null>(null)
const showDeleteConfirm = ref(false)
const locationToDelete = ref<UserLocation | null>(null)
const selectedLocationId = ref<number | string | null>(null)
const activating = ref(false)

const locations = computed(() => {
  return locationsStore.locations || []
})

// Устанавливаем выбранную локацию по умолчанию (активная, если есть)
watch(
  () => locations.value,
  (newLocations) => {
    if (newLocations.length > 0 && !selectedLocationId.value) {
      const activeLocation = newLocations.find(loc => loc.is_active)
      selectedLocationId.value = activeLocation ? activeLocation.id : newLocations[0].id
    }
  },
  { immediate: true }
)

// Загружаем локации при открытии модалки
watch(
  () => props.modelValue,
  async (value) => {
    console.log('[SelectLocationModal] Modal opened:', value)
    if (value) {
      loading.value = true
      try {
        await locationsStore.fetchLocations()
        console.log('[SelectLocationModal] Locations loaded:', locationsStore.locations.length)
        console.log('[SelectLocationModal] Locations data:', locationsStore.locations)
      } catch (error) {
        console.error('[SelectLocationModal] Error loading locations:', error)
        handleError(error)
      } finally {
        loading.value = false
      }
    } else {
      // Сбрасываем состояние при закрытии
      showDeleteConfirm.value = false
      locationToDelete.value = null
      deletingLocationId.value = null
      selectedLocationId.value = null
      activating.value = false
    }
  },
  { immediate: true }
)

// Подтверждение выбора локации (активация)
const handleConfirm = async () => {
  if (!selectedLocationId.value) return
  
  const selectedLocation = locations.value.find(loc => loc.id === selectedLocationId.value)
  if (!selectedLocation) return
  
  // Если локация уже активна - просто закрываем модалку
  if (selectedLocation.is_active) {
    emit('update:model-value', false)
    return
  }

  activating.value = true
  try {
    // Активируем выбранную локацию
    await locationsStore.activateLocation(selectedLocation.id)

    // Обновляем список магазинов
    await mainStore.fetchNearbyStores()

    // Обновляем категории
    await categoriesStore.fetchCategories()

    showToast(t('success_send') || 'Адрес успешно изменен', 'success')

    // Закрываем модалку и эмитим событие
    emit('location-selected')
    emit('update:model-value', false)
  } catch (error) {
    handleError(error)
  } finally {
    activating.value = false
  }
}

// Удаление локации
const handleDelete = (location: UserLocation) => {
  locationToDelete.value = location
  showDeleteConfirm.value = true
}

// Подтверждение удаления
const confirmDelete = async () => {
  if (!locationToDelete.value) return

  deletingLocationId.value = locationToDelete.value.id
  try {
    await locationsStore.deleteLocation(locationToDelete.value.id)

    showToast(t('success_deleted') || 'Адрес успешно удален', 'success')

    // Если удалили активную локацию, обновляем магазины и категории
    if (locationToDelete.value.is_active) {
      await mainStore.fetchNearbyStores()
      await categoriesStore.fetchCategories()
    }

    // Обновляем список локаций
    await locationsStore.fetchLocations()

    showDeleteConfirm.value = false
    locationToDelete.value = null
  } catch (error) {
    handleError(error)
  } finally {
    deletingLocationId.value = null
  }
}

// Переход к добавлению нового адреса
const handleAddNew = () => {
  emit('add-new')
  emit('update:model-value', false)
}
</script>
