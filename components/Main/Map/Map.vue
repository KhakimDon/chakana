<template>
  <div class="p-4 pt-3 rounded-xl bg-gray-300">
    <p class="text-xs leading-130 font-medium text-dark">
      {{ $t('your_address') }}
    </p>
    <p class="mt-0.5 text-sm leading-130 font-bold text-dark mb-4">
      {{ title }}
    </p>
    <div class="relative overflow-hidden rounded-xl">
      <MainMap
        :key="coordinates"
        :center="coordinates"
        no-actions
        class="w-full h-[150px]"
      />
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
import { CONFIG } from '~/config'
import { useAddressStore } from '~/store/address'

const { t } = useI18n()

const addressStore = useAddressStore()

const savedCoords = computed(() => addressStore.coordinates)
const savedAddress = computed(() => addressStore.savedAddress)

const coordinates = ref([69.240562, 41.311081])
const title = ref(t('amir_temur'))

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
                position.coords.longitude,
                position.coords.latitude,
              ]

              getLocation()
            })
          }, 5000)
        } else if (res?.state === 'granted') {
          navigator.geolocation.getCurrentPosition(function (position) {
            coordinates.value = [
              position.coords.longitude,
              position.coords.latitude,
            ]
            getLocation()
          })
        } else {
          coordinates.value = [69.240562, 41.311081]
        }
      })
      .catch(() => {
        coordinates.value = [69.240562, 41.311081]
      })
  }
})

function submit() {
  addressStore.coordinates = coordinates.value
}

function clearCoords() {
  addressStore.coordinates = []
}

watch(
  () => savedAddress.value,
  (val) => {
    if (val) {
      if (val.id) {
        coordinates.value = [val.latitude, val.longitude]
        title.value = val.street
      }
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>
