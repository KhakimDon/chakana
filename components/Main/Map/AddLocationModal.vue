<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('add_address') || 'Добавить адрес'"
    body-class="!max-w-[868px] !w-full"
    disable-outer-close
    @update:model-value="emit('update:model-value', $event)"
  >
    <div v-if="!showAddressForm">
      <!-- Поиск адреса -->
      <p class="text-dark-100 text-sm font-medium leading-140 mb-4">
        {{ $t('map_modal_desc') || 'Найдите ваш адрес на карте или введите его в поле поиска' }}
      </p>
      <div class="flex mt-4 gap-x-4 gap-y-2">
        <div class="relative w-full">
          <FormInputSearch
            v-model="searchQuery"
            :no-clear="false"
            :no-search-icon="false"
            :placeholder="$t('search') || 'Поиск'"
            @blur="handleBlur"
            @focus="handleFocus"
            @search="handleSearch"
          />
          <Transition mode="out-in" name="fade">
            <div
              v-if="showSuggestions"
              class="bg-white w-full max-h-[400px] absolute top-full left-0 right-0 rounded-xl shadow-map z-50 overflow-hidden overflow-y-auto mt-2"
            >
              <ul>
                <li
                  v-for="(item, index) in addressSuggestions"
                  :key="index"
                  class="cursor-pointer"
                >
                  <p
                    class="px-4 py-3 border border-white-100 text-dark text-sm leading-130 font-semibold last:border-b-0 hover:bg-gray-200 transition-300"
                    @mousedown.prevent
                    @click="selectAddress(item)"
                  >
                    {{ item.address }}
                  </p>
                </li>
              </ul>
            </div>
          </Transition>
        </div>
        <BaseButton
          :disabled="!selectedCoords.length"
          :loading="false"
          :text="$t('confirm') || 'Подтвердить'"
          class="shrink-0 !py-2.5 !px-7 !rounded-[10px]"
          variant="primary"
          @click="showAddressForm = true"
        />
      </div>
      <!-- Карта -->
      <div class="rounded-10 overflow-x-auto mt-4">
        <Map
          :zoom="15"
          class="h-[300px] md:h-[440px]"
          @update:center="handleMapCenterChange"
        />
      </div>
    </div>

    <!-- Форма добавления адреса -->
    <div v-else>
      <div class="relative">
        <AddAddressMap
          :center="selectedCoords"
          :zoom="15"
          class="h-[180px] w-full mt-4 rounded-lg"
          no-actions
          no-controls
          @update:center="selectedCoords = $event"
        />
        <p
          class="bg-white mr-12 flex items-center justify-between shadow-card absolute left-1.5 md:left-2.5 right-1.5 md:right-2.5 bottom-1.5 md:bottom-2.5 text-dark text-sm font-medium px-3 py-2 rounded-[10px]"
        >
          <span class="max-w-[250px] md:max-w-[400px] truncate">
            {{ currentAddress }}
          </span>
          <IEditCircle
            class="text-white text-xl cursor-pointer"
            @click="showAddressForm = false"
          />
        </p>
      </div>

      <!-- Поля формы -->
      <div class="mt-6 gap-x-4 gap-y-2 grid sm:grid-cols-2">
        <FormGroup :label="$t('select_icon') || 'Выберите иконку'">
          <FormSelect
            v-model="formData.location_icon"
            :options="locationIcons"
            :placeholder="$t('select_icon') || 'Выберите иконку'"
            head-styles="h-11"
            is-radio
            label-key="title"
            value-key="id"
          />
        </FormGroup>

        <FormGroup :label="$t('name_address') || 'Название адреса'">
          <FormInput
            v-model="formData.title"
            :placeholder="$t('name_address') || 'Например: Дом, Офис'"
          />
        </FormGroup>

        <FormGroup :label="$t('apartment') || 'Квартира'">
          <FormInput
            v-model="formData.apartment"
            :placeholder="$t('apartment_number') || 'Номер квартиры'"
            class="px-3"
            input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
          />
        </FormGroup>

        <FormGroup :label="$t('entrance') || 'Подъезд'">
          <FormInput
            v-model="formData.entrance"
            :placeholder="$t('entrance') || 'Номер подъезда'"
            class="px-3"
            input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
          />
        </FormGroup>

        <FormGroup :label="$t('floor') || 'Этаж'">
          <FormInput
            v-model="formData.floor"
            :placeholder="$t('floor') || 'Номер этажа'"
            class="px-3"
            input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
          />
        </FormGroup>

        <FormGroup :label="$t('entrance_code') || 'Код домофона'">
          <FormInput
            v-model="formData.door_password"
            :placeholder="$t('entrance_code') || 'Код домофона'"
            class="px-3"
            input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
          />
        </FormGroup>
      </div>

      <!-- Кнопки -->
      <div class="flex items-center gap-4 mt-6">
        <BaseButton
          :text="$t('cancel') || 'Отмена'"
          class="w-full group"
          variant="secondary"
          @click="showAddressForm = false"
        />
        <BaseButton
          :disabled="!canSubmit"
          :loading="buttonLoading"
          :text="$t('add') || 'Добавить'"
          class="w-full group"
          variant="primary"
          @click="submitLocation"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import IEditCircle from '~/assets/icons/Common/edit-circle.svg'
import { useLocationsStore } from '~/store/locations'
import { useMainStore } from '~/store/main'
import { useCategoriesStore } from '~/store/categories'
import { useCustomToast } from '~/composables/useCustomToast'
import { useErrorHandling } from '~/composables/useErrorHandling'
import type { AddressSuggestionItem } from '~/types/locations'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

interface Emits {
  (e: 'update:model-value', value: boolean): void
  (e: 'location-added'): void
}

const emit = defineEmits<Emits>()

const { t } = useI18n()
const { showToast } = useCustomToast()
const { handleError } = useErrorHandling()

const locationsStore = useLocationsStore()
const mainStore = useMainStore()
const categoriesStore = useCategoriesStore()

const searchQuery = ref('')
const isFocus = ref(false)
const showAddressForm = ref(false)
const selectedCoords = ref<number[]>([])
const currentAddress = ref('')
const buttonLoading = ref(false)
const addressSuggestions = ref<AddressSuggestionItem[]>([])

const formData = ref({
  title: '',
  apartment: '',
  entrance: '',
  floor: '',
  door_password: '',
  location_icon: null as number | null,
})

// Преобразуем иконки для FormSelect (добавляем поле image из icon)
const locationIcons = computed(() => {
  return locationsStore.locationIcons.map(icon => ({
    ...icon,
    image: icon.icon || icon.icon || '',
  }))
})

const canSubmit = computed(() => {
  return (
    selectedCoords.value.length === 2 &&
    formData.value.title.trim().length > 0
  )
})

// Показывать подсказки когда они есть
const showSuggestions = computed(() => {
  const hasSuggestions = addressSuggestions.value.length > 0
  console.log('[AddLocationModal] showSuggestions:', hasSuggestions, 'count:', addressSuggestions.value.length)
  return hasSuggestions
})

// Загружаем иконки при открытии модалки
watch(
  () => props.modelValue,
  async (value) => {
    if (value) {
      // Сбрасываем форму
      resetForm()
      // Загружаем иконки всегда при открытии модалки
      try {
        await locationsStore.fetchLocationIcons()
      } catch (error) {
        console.error('[AddLocationModal] Error loading icons:', error)
      }
      // Получаем текущее местоположение
      getCurrentLocation()
    }
  }
)

// Загружаем иконки при переходе на вторую часть формы
watch(
  () => showAddressForm.value,
  async (value) => {
    if (value && !locationIcons.value.length) {
      // Если перешли на вторую часть и иконок нет - загружаем
      try {
        await locationsStore.fetchLocationIcons()
      } catch (error) {
        console.error('[AddLocationModal] Error loading icons:', error)
      }
    }
  }
)

// Автоматический поиск при изменении текста в инпуте
watch(
  () => searchQuery.value,
  async (newValue, oldValue) => {
    console.log('[AddLocationModal] searchQuery changed:', oldValue, '->', newValue)
    if (newValue && newValue.length >= 2) {
      await handleSearch(newValue)
    } else if (newValue.length < 2) {
      addressSuggestions.value = []
    }
  },
  { immediate: false }
)

// Обработка фокуса
const handleFocus = () => {
  isFocus.value = true
  // Если уже есть подсказки, показываем их
  if (addressSuggestions.value.length > 0) {
    return
  }
  // Если есть текст в инпуте, запускаем поиск
  if (searchQuery.value.length >= 2) {
    handleSearch(searchQuery.value)
  }
}

// Поиск адресов
const handleSearch = async (query: string) => {
  if (query.length < 2) {
    addressSuggestions.value = []
    return
  }
  try {
    console.log('[AddLocationModal] Searching for:', query)
    console.log('[AddLocationModal] Store before call:', locationsStore.addressSuggestions.length)
    await locationsStore.searchAddressSuggestions(query)
    console.log('[AddLocationModal] Store after call:', locationsStore.addressSuggestions.length)
    console.log('[AddLocationModal] Store data:', locationsStore.addressSuggestions)
    addressSuggestions.value = [...locationsStore.addressSuggestions]
    console.log('[AddLocationModal] Address suggestions loaded:', addressSuggestions.value.length)
    console.log('[AddLocationModal] Suggestions data:', addressSuggestions.value)
  } catch (error) {
    console.error('[AddLocationModal] Error searching addresses:', error)
    addressSuggestions.value = []
  }
}

// Обработка blur - скрываем подсказки с небольшой задержкой для возможности клика
const handleBlur = () => {
  // Небольшая задержка чтобы можно было кликнуть на подсказку
  setTimeout(() => {
    isFocus.value = false
  }, 200)
}

// Выбор адреса из предложений
const selectAddress = (item: AddressSuggestionItem) => {
  searchQuery.value = item.address
  selectedCoords.value = [item.longitude, item.latitude]
  addressSuggestions.value = []
  isFocus.value = false
  getAddressFromCoords(selectedCoords.value)
}

// Обработка изменения центра карты (при клике или перетаскивании)
const handleMapCenterChange = (coords: number[]) => {
  console.log('[AddLocationModal] Map center changed:', coords)
  selectedCoords.value = coords
  getAddressFromCoords(coords)
}

// Получение адреса по координатам
const getAddressFromCoords = async (coords: number[]) => {
  console.log('[AddLocationModal] getAddressFromCoords called with coords:', coords)
  if (coords.length !== 2) {
    console.log('[AddLocationModal] Invalid coords length')
    return
  }
  try {
    console.log('[AddLocationModal] Calling reverseGeocode with lat:', coords[1], 'lng:', coords[0])
    const response = await locationsStore.reverseGeocode(coords[1], coords[0])
    console.log('[AddLocationModal] Reverse geocode response:', response)
    console.log('[AddLocationModal] Response type:', typeof response)
    console.log('[AddLocationModal] Response keys:', Object.keys(response || {}))
    console.log('[AddLocationModal] response.data:', response?.data)
    console.log('[AddLocationModal] response.data?.long_address:', response?.data?.long_address)
    
    // Используем long_address для инпута (как просил пользователь)
    // Проверяем оба формата ответа
    let address = ''
    if (response?.data?.long_address) {
      address = response.data.long_address
      console.log('[AddLocationModal] Using response.data.long_address')
    } else if (response?.data?.short_address) {
      address = response.data.short_address
      console.log('[AddLocationModal] Using response.data.short_address')
    } else if (response?.long_address) {
      address = response.long_address
      console.log('[AddLocationModal] Using response.long_address')
    } else if (response?.short_address) {
      address = response.short_address
      console.log('[AddLocationModal] Using response.short_address')
    }
    
    console.log('[AddLocationModal] Extracted address:', address)
    currentAddress.value = address
    // Обновляем инпут поиска с полученным адресом (long_address)
    if (address) {
      console.log('[AddLocationModal] Setting searchQuery to:', address)
      searchQuery.value = address
      console.log('[AddLocationModal] searchQuery after setting:', searchQuery.value)
    } else {
      console.warn('[AddLocationModal] Address is empty! Response:', JSON.stringify(response, null, 2))
    }
  } catch (error) {
    console.error('[AddLocationModal] Error getting address:', error)
    currentAddress.value = ''
  }
}

// Получение текущего местоположения
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        selectedCoords.value = [
          position.coords.longitude,
          position.coords.latitude,
        ]
        getAddressFromCoords(selectedCoords.value)
      },
      () => {
        // Если не удалось получить геолокацию, используем центр Ташкента
        selectedCoords.value = [69.240562, 41.311081]
        getAddressFromCoords(selectedCoords.value)
      }
    )
  } else {
    selectedCoords.value = [69.240562, 41.311081]
    getAddressFromCoords(selectedCoords.value)
  }
}

// Отслеживание изменения координат на карте (убрано, так как теперь обрабатывается через handleMapCenterChange)

// Сброс формы
const resetForm = () => {
  showAddressForm.value = false
  searchQuery.value = ''
  currentAddress.value = ''
  selectedCoords.value = []
  formData.value = {
    title: '',
    apartment: '',
    entrance: '',
    floor: '',
    door_password: '',
    location_icon: null,
  }
  addressSuggestions.value = []
  isFocus.value = false
}

// Отправка локации
const submitLocation = async () => {
  if (!canSubmit.value) return

  buttonLoading.value = true
  try {
    // Округляем координаты до 6 знаков после запятой (максимум 9 цифр всего)
    const latitude = parseFloat(selectedCoords.value[1].toFixed(6))
    const longitude = parseFloat(selectedCoords.value[0].toFixed(6))
    
    const locationData: any = {
      title: formData.value.title,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      address: currentAddress.value,
    }
    
    // Добавляем опциональные поля только если они заполнены
    if (formData.value.apartment?.trim()) {
      locationData.apartment = formData.value.apartment.trim()
    }
    if (formData.value.entrance?.trim()) {
      locationData.entrance = formData.value.entrance.trim()
    }
    if (formData.value.floor?.trim()) {
      locationData.floor = formData.value.floor.trim()
    }
    if (formData.value.door_password?.trim()) {
      locationData.door_password = formData.value.door_password.trim()
    }
    // location_icon - ID иконки (обязательно если выбрана)
    if (formData.value.location_icon) {
      locationData.location_icon = formData.value.location_icon
    }
    
    console.log('[AddLocationModal] Final locationData:', locationData)

    // Создаем локацию
    console.log('[AddLocationModal] Creating location with data:', locationData)
    const newLocation = await locationsStore.createLocation(locationData)
    console.log('[AddLocationModal] Created location:', newLocation)
    console.log('[AddLocationModal] Location ID:', newLocation?.id)

    // Активируем созданную локацию
    if (newLocation?.id) {
      console.log('[AddLocationModal] Activating location with ID:', newLocation.id)
      await locationsStore.activateLocation(newLocation.id)
    } else {
      console.error('[AddLocationModal] Location ID is missing!', newLocation)
      throw new Error('Location ID is missing after creation')
    }

    showToast(t('success_send') || 'Адрес успешно добавлен', 'success')

    // Обновляем список магазинов
    await mainStore.fetchNearbyStores()

    // Обновляем категории в сайдбаре
    await categoriesStore.fetchCategories()

    // Закрываем модалку и эмитим событие
    emit('location-added')
    emit('update:model-value', false)
    resetForm()
  } catch (error) {
    handleError(error)
  } finally {
    buttonLoading.value = false
  }
}
</script>
