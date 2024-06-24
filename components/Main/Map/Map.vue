<template>
  <div class="p-4 pt-3 rounded-xl bg-gray-300">
    <p class="text-xs leading-130 font-medium text-dark">
      {{ $t('your_address') }}
    </p>
    <p class="mt-0.5 text-sm leading-130 font-bold text-dark mb-4">
      {{ title }}
    </p>
    <div class="relative overflow-hidden rounded-xl">
      <YandexMap
        id="myMap"
        ref="yMap"
        :settings="settings"
        class="ymap w-full h-[124px]"
        :coords="coordinates"
      >
        <!--      @click="changeCoords"-->
        <YmapMarker :coords="coordinates" />
      </YandexMap>
    </div>

    <div v-if="!savedCoords?.length" class="flex-y-center gap-3 mt-4">
      <BaseButton class="w-full" :text="$t('yes_it_is')" @click="submit" />
      <BaseButton
        class="w-full"
        :text="$t('no_other')"
        variant="secondary-dark"
        @click="$emit('change-coords')"
      />
    </div>
    <div v-else class="flex-y-center gap-3 mt-4">
      <BaseButton
        class="w-full"
        :text="$t('change_address')"
        @click="clearCoords"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  loadYmap,
  yandexMap as YandexMap,
  ymapMarker as YmapMarker,
} from 'vue-yandex-maps'

import { CONFIG } from '~/config'
import { useAddressStore } from '~/store/address'

const { t } = useI18n()

const addressStore = useAddressStore()

const savedCoords = computed(() => addressStore.coordinates)

const coordinates = ref([41.310329, 69.279935])
const title = ref(t('amir_temur'))

const settings = {
  apiKey: CONFIG.YANDEX_KEY,
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1',
}
loadYmap({ ...settings })

function getLocation() {
  useApi()
    .$get('get/address', {
      params: {
        latitude: coordinates.value[0],
        longitude: coordinates.value[1],
      },
    })
    .then((res: any) => {
      title.value = res.full
    })
}

onMounted(() => {
  if (process.client) {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((res) => {
        if (res?.state === 'prompt') {
          setTimeout(() => {
            navigator.geolocation.getCurrentPosition(function (position) {
              coordinates.value = [
                position.coords.latitude,
                position.coords.longitude,
              ]

              getLocation()
            })
          }, 5000)
        } else if (res?.state === 'granted') {
          navigator.geolocation.getCurrentPosition(function (position) {
            coordinates.value = [
              position.coords.latitude,
              position.coords.longitude,
            ]
            getLocation()
          })
        } else {
          coordinates.value = [41.310329, 69.279935]
        }
      })
      .catch(() => {
        coordinates.value = [41.310329, 69.279935]
      })
  }
})

function submit() {
  addressStore.coordinates = coordinates.value
}

function clearCoords() {
  addressStore.coordinates = []
}
</script>

<style>
.ymaps-2-1-79-controls__toolbar,
.ymaps-2-1-79-map-copyrights-promo,
.ymaps-2-1-79-controls__control,
.ymaps-2-1-79-copyright__wrap {
  display: none !important;
}
</style>
