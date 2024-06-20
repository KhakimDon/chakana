<template>
  <BaseModal
    v-bind="{ show: openModal }"
    :has-back="!showAddAddress"
    :body-class="
      !showAddAddress ? 'max-w-[868px] !w-full' : '!max-w-[646px] !w-full'
    "
    :title="$t('specify_your_delivery_address')"
    disable-outer-close
    @back="$emit('open-saved-adress')"
    @close="$emit('close')"
  >
    <div v-if="!showAddAddress">
      <p class="text-dark-100 text-sm font-medium leading-140">
        {{ $t('map_modal_desc') }}
      </p>
      <div class="grid grid-cols-12 mt-4 gap-x-4 gap-y-2">
        <div class="relative col-span-12 sm:col-span-8 md:col-span-9">
          <FormInputSearch
            v-model="search"
            :no-search-icon="false"
            :no-clear="false"
            placeholder="Se$arch"
            :error="error"
            @search="searchQuery"
            @focus="isFocus = true"
            @blur="isFocus = false"
          />
          <Transition name="fade" mode="out-in">
            <div
              v-if="openSearchList && searchAddressList.length && isFocus"
              class="bg-white w-full h-[400px] absolute rounded-xl shadow-map z-10 overflow-hidden overflow-y-scroll mt-2"
            >
              <ul>
                <li
                  v-for="item in [...searchAddressList, ...searchAddressList]"
                  :key="item.id"
                  class="cursor-pointer"
                >
                  <p
                    class="px-4 py-3 border border-white-100 text-dark text-sm leading-130 font-semibold last:border-b-0 hover:bg-gray-200 transition-300"
                    @click="changeCoords(item)"
                  >
                    {{ item.address }}
                  </p>
                </li>
              </ul>
            </div>
          </Transition>
        </div>
        <BaseButton
          class="col-span-12 sm:col-span-4 md:col-span-3"
          :loading="false"
          :text="$t('confirm')"
          variant="primary"
          @click="addAddress"
        />
      </div>
      <ClientOnly>
        <YandexMap
          id="myMap"
          ref="yMap"
          :settings="settings"
          class="ymap h-[300px] md:h-[440px] w-full mt-4 rounded-lg"
          :coords="coordinates"
          @click="setLocation($event)"
        >
          <!--      @click="changeCoords"-->
          <YmapMarker :coords="coordinates" :icon="'/images/svg/map-pin.svg'" />
        </YandexMap>
      </ClientOnly>
    </div>
    <div v-else>
      <div class="relative">
        <ClientOnly>
          <YandexMap
            id="myMap"
            ref="yMap"
            :settings="settings"
            class="h-[180px] w-full mt-4 rounded-lg"
            :coords="coordinates"
          >
            <!--      @click="changeCoords"-->
            <YmapMarker
              :coords="coordinates"
              :icon="'/images/svg/map-pin.svg'"
            />
          </YandexMap>
        </ClientOnly>
        <p
          class="bg-white flex items-center justify-between shadow-card absolute left-1.5 md:left-2.5 right-1.5 md:right-2.5 bottom-1.5 md:bottom-2.5 text-dark text-sm font-medium px-3 py-2 rounded-[10px]"
        >
          <span class="max-w-[250px] md:max-w-[400px] truncate">{{
            search
          }}</span>
          <IEditCircle
            class="text-white text-xl cursor-pointer"
            @click="showAddAddress = false"
          />
        </p>
      </div>
      <div class="mt-6 gap-x-4 gap-y-2 grid sm:grid-cols-2">
        <FormGroup :label="$t('select_icon')">
          <FormSelect
            v-model="selectIcons"
            :options="icons"
            label-key="title"
            value-key="id"
            head-styles="h-11"
            :placeholder="$t('select_icon')"
            is-radio
            :error="error"
          />
        </FormGroup>
        <FormGroup :label="$t('name_address')">
          <FormInput
            v-model="nameAddress"
            :placeholder="$t('name_address')"
            :error="error"
          />
        </FormGroup>
      </div>
      <div class="flex items-center gap-4 mt-6">
        <BaseButton
          class="w-full group"
          :loading="false"
          :text="$t('cancel')"
          variant="secondary"
          @click="$emit('close')"
        />
        <BaseButton
          class="w-full group"
          :loading="buttonLoading"
          :text="$t('add')"
          variant="primary"
          @click="sendAddress"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import {
  loadYmap,
  yandexMap as YandexMap,
  ymapMarker as YmapMarker,
} from 'vue-yandex-maps'

import IEditCircle from '~/assets/icons/Common/edit-circle.svg'
import { useCustomToast } from '~/composables/useCustomToast.js'
import { CONFIG } from '~/config/index.js'
import { useAddressStore } from '~/store/address.js'

interface Props {
  openModal?: boolean
  list?: any
}

interface Emits {
  (e: 'close', v: boolean): void
}

defineProps<Props>()
const $emit = defineEmits<Emits>()
const addressStore = useAddressStore()
const { handleError } = useErrorHandling()
const { showToast } = useCustomToast()

const searchAddressList = computed(() => addressStore.searchAddressList.list)
const addressClick = computed(() => addressStore.addressMap.list)

const buttonLoading = ref<boolean>(false)
const coordinates = ref([41.377541, 69.237922])
const showAddAddress = ref(false)
const selectIcons = ref<number | string | { [key: string]: string | number }>()
const search = ref<string>('')
const isFocus = ref<boolean>(false)
const openSearchList = ref<boolean>(false)
const nameAddress = ref<string>('')
const error = ref<boolean>(false)

const settings = {
  apiKey: CONFIG.YANDEX_KEY,
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1',
}
loadYmap({ ...settings })

const { list: icons } = useListFetcher('get/icons', 10, false)

const setLocation = async (event: any) => {
  search.value = addressClick.value?.street
  const coords = event?.get('coords')
  coordinates.value = coords
  coordinates.value = coords
  await addressStore.fetchAddress(coords[0], coords[1])
}

const addAddress = () => {
  if (search.value) {
    showAddAddress.value = true
  } else {
    error.value = true
  }
}

const searchQuery = (e: string) => {
  search.value = e
  addressStore.searchAddress(search.value)
  openSearchList.value = true
}

const changeCoords = (item: any) => {
  search.value = item.address
  coordinates.value = [item.latitude, item.longitude]
  openSearchList.value = false
}

function sendAddress() {
  if (search.value && selectIcons.value && nameAddress.value) {
    buttonLoading.value = true
    useApi()
      .$post('/saved/address', {
        body: {
          icon_id: selectIcons.value,
          title: nameAddress.value,
          street: addressClick.value.street,
          zip: addressClick.value.zip,
          latitude: coordinates.value[0],
          longitude: coordinates.value[1],
        },
      })
      .then((res: any) => {
        if (res.saved) {
          showToast('Muvaffaqiyatli yuborildi', 'success')
        }
      })
      .catch((err: any) => {
        handleError(err)
      })
      .finally(() => {
        buttonLoading.value = false
        showAddAddress.value = false
        $emit('close')
      })
  } else {
    error.value = true
  }
}

watch(
  () => selectIcons.value,
  () => {
    if (search.value) {
      error.value = false
    } else {
      error.value = true
    }
  }
)
</script>
<style scoped>
/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #f2f2f2;
  height: 4px !important;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #dadada;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #dadada;
}
</style>
