<template>
  <BaseModal
    v-bind="{ show: openModal }"
    :has-back="!showAddAddress"
    :body-class="!showAddAddress ? 'min-w-[868px]' : '!min-w-[646px]'"
    :title="$t('specify_your_delivery_address')"
    @close="$emit('close')"
  >
    <div v-if="!showAddAddress">
      <p class="text-dark-100 text-sm font-medium leading-140">
        {{ $t('map_modal_desc') }}
      </p>
      <div class="grid grid-cols-12 mt-4 gap-4">
        <div class="relative col-span-9">
          <FormInputSearch
            v-model="search"
            :no-search-icon="false"
            :no-clear="false"
            placeholder="Search"
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
          class="col-span-3"
          :loading="false"
          :text="$t('confirm')"
          variant="primary"
          @click="addAddress"
        />
      </div>
      <YandexMap
        id="myMap"
        ref="yMap"
        :settings="settings"
        class="ymap h-[440px] w-[828px] mt-4 rounde-lg"
        :coords="coordinates"
        @click="setLocation($event)"
      >
        <!--      @click="changeCoords"-->
        <YmapMarker :coords="coordinates" :icon="'/images/svg/map-pin.svg'" />
      </YandexMap>
    </div>
    <div v-else>
      <div class="relative">
        <YandexMap
          id="myMap"
          ref="yMap"
          :settings="settings"
          class="h-[180px] w-[606px] mt-4 rounded-lg"
          :coords="coordinates"
        >
          <!--      @click="changeCoords"-->
          <YmapMarker :coords="coordinates" :icon="'/images/svg/map-pin.svg'" />
        </YandexMap>
        <p
          class="bg-white flex items-center justify-between shadow-card w-[590px] absolute bottom-[10px] text-dark text-sm font-medium px-3 py-2 rounded-[10px]"
        >
          <span class="max-w-[400px] truncate">{{ search }}</span>
          <IEditCircle
            class="text-white text-xl cursor-pointer"
            @click="showAddAddress = false"
          />
        </p>
      </div>
      <div class="flex items-center mt-6 gap-4">
        <label class="text-dark text-sm font-medium leading-130">
          {{ $t('select_icon') }}
          <FormSelect
            v-model="selectIcons"
            :options="icons"
            label-key="title"
            value-key="id"
            :placeholder="$t('select_icon')"
            class="w-[295px] mt-1"
            is-radio
          />
        </label>
        <label class="text-dark text-sm font-medium leading-130">
          {{ $t('name_address') }}
          <FormInput
            v-model="nameAddress"
            :placeholder="$t('name_address')"
            class="w-[290px] mt-1"
          />
        </label>
      </div>
      <div class="flex items-center gap-4">
        <BaseButton
          class="mt-6 w-full group"
          :loading="false"
          :text="$t('cancel')"
          variant="secondary"
          @click="$emit('close')"
        />
        <BaseButton
          class="mt-6 w-full group"
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
import { CONFIG } from '~/config/index.js'
import { useMainStore } from '~/store/main.js'
import { useSearchStore } from '~/store/search.js'

const seachStore = useSearchStore()
const store = useMainStore()
const { handleError } = useErrorHandling()

const coordinates = ref([41.377541, 69.237922])
const showAddAddress = ref(false)
const selectIcons = ref<number | string | { [key: string]: string | number }>()

const addAddress = () => {
  showAddAddress.value = true
}

const settings = {
  apiKey: CONFIG.YANDEX_KEY,
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1',
}
loadYmap({ ...settings })

interface Props {
  openModal?: boolean
  list?: any
}

const search = ref<string>('')
const isFocus = ref<boolean>(false)
const openSearchList = ref<boolean>(false)
const searchQuery = (e: string) => {
  search.value = e
  seachStore.searchAddress(search.value)
  openSearchList.value = true
}

const searchAddressList = computed(() => seachStore.searchAddressList.list)
const addressClick = computed(() => store.addressMap.list)
const buttonLoading = ref<boolean>(false)

const { list: icons } = useListFetcher('get/icons', 10, false)

const setLocation = async (event: any) => {
  search.value = addressClick.value?.street
  const coords = event.get('coords')
  coordinates.value = coords
  coordinates.value = coords
  store.fetchAddress(coords[0], coords[1])
}

interface Emits {
  (e: 'close', v: boolean): void
}

const $emit = defineEmits<Emits>()

const changeCoords = (item: any) => {
  search.value = item.address
  coordinates.value = [item.latitude, item.longitude]
  openSearchList.value = false
}

function sendAddress() {
  buttonLoading.value = true
  useApi()
    .$post('/saved/address', {
      body: {
        icon_id: selectIcons.value,
        title: addressClick.value.title,
        street: addressClick.value.street,
        zip: addressClick.value.zip,
        latitude: coordinates.value[0],
        longitude: coordinates.value[1],
      },
    })
    .then((res: any) => {
      console.log(res)
    })
    .catch((err) => {
      handleError(err)
    })
    .finally(() => {
      buttonLoading.value = false
      $emit('close')
    })
}

defineProps<Props>()
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
