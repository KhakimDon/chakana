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
            @blur="isFocus = false"
            @focus="isFocus = true"
            @search="handleSearch"
          />
          <Transition mode="out-in" name="fade">
            <div
              v-if="isFocus && addressSuggestions.length"
              class="bg-white w-full max-h-[400px] absolute rounded-xl shadow-map z-10 overflow-hidden overflow-y-scroll mt-2"
            >
              <ul>
                <li
                  v-for="(item, index) in addressSuggestions"
                  :key="index"
                  class="cursor-pointer"
                >
                  <p
                    class="px-4 py-3 border border-white-100 text-dark text-sm leading-130 font-semibold last:border-b-0 hover:bg-gray-200 transition-300"
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
          @update:center="selectedCoords = $event"
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

const locationIcons = computed(() => locationsStore.locationIcons)

const canSubmit = computed(() => {
  return (
    selectedCoords.value.length === 2 &&
    formData.value.title.trim().length > 0
  )
})

// Загружаем иконки при открытии модалки
watch(
  () => props.modelValue,
  async (value) => {
    if (value) {
      // Сбрасываем форму
      resetForm()
      // Загружаем иконки если их нет
      if (!locationIcons.value.length) {
        await locationsStore.fetchLocationIcons()
      }
      // Получаем текущее местоположение
      getCurrentLocation()
    }
  }
)

// Поиск адресов
const handleSearch = async (query: string) => {
  if (query.length < 2) {
    addressSuggestions.value = []
    return
  }
  searchQuery.value = query
  try {
    await locationsStore.searchAddressSuggestions(query)
    addressSuggestions.value = locationsStore.addressSuggestions
  } catch (error) {
    console.error('Error searching addresses:', error)
  }
}

// Выбор адреса из предложений
const selectAddress = (item: AddressSuggestionItem) => {
  searchQuery.value = item.address
  selectedCoords.value = [item.longitude, item.latitude]
  addressSuggestions.value = []
  isFocus.value = false
  getAddressFromCoords(selectedCoords.value)
}

// Получение адреса по координатам
const getAddressFromCoords = async (coords: number[]) => {
  if (coords.length !== 2) return
  try {
    const response = await locationsStore.reverseGeocode(coords[1], coords[0])
    currentAddress.value = response.short_address || response.long_address || ''
  } catch (error) {
    console.error('Error getting address:', error)
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

// Отслеживание изменения координат на карте
watch(
  () => selectedCoords.value,
  (coords) => {
    if (coords.length === 2 && !showAddressForm.value) {
      getAddressFromCoords(coords)
    }
  },
  { deep: true }
)

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
}

// Отправка локации
const submitLocation = async () => {
  if (!canSubmit.value) return

  buttonLoading.value = true
  try {
    const locationData = {
      title: formData.value.title,
      latitude: selectedCoords.value[1].toString(),
      longitude: selectedCoords.value[0].toString(),
      address: currentAddress.value,
      apartment: formData.value.apartment || undefined,
      entrance: formData.value.entrance || undefined,
      floor: formData.value.floor || undefined,
      door_password: formData.value.door_password || undefined,
      location_icon: formData.value.location_icon || undefined,
    }

    // Создаем локацию
    const newLocation = await locationsStore.createLocation(locationData)

    // Активируем созданную локацию
    await locationsStore.activateLocation(newLocation.id)

    showToast(t('success_send') || 'Адрес успешно добавлен', 'success')

    // Обновляем список магазинов
    await mainStore.fetchNearbyStores()

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
