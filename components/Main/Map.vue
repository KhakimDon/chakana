<template>
  <section>
    <div id="map" :class="mapClass"></div>
  </section>
</template>

<script setup lang="ts">
import { load } from '@2gis/mapgl'

interface Props {
  center?: number[]
  mapClass?: string
  noControls?: boolean
  zoom?: number
  noActions?: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:center', value: number[]): void
}>()

const mapInstance = ref()
const markers = ref([])

const tashkentCenter = ref([69.240562, 41.311081])

const clearMarkers = () => {
  if (markers.value.length > 0) {
    markers.value.forEach((marker) => {
      marker.destroy()
    })
  }
}

load().then((mapglAPI) => {
  mapInstance.value = new mapglAPI.Map('map', {
    center: props.center?.length ? props.center : tashkentCenter.value,
    zoom: props.zoom ?? 15,
    key: import.meta.env.VITE_2GIS_KEY,
  })

  if (!props.noControls) {
    const control = new mapgl.Control(
      mapInstance.value,
      `<button>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11.5 20.95v-.961q-3.125-.293-5.16-2.328q-2.036-2.036-2.328-5.161H3.05q-.212 0-.356-.144t-.144-.357t.144-.356t.356-.143h.962q.292-3.125 2.328-5.16t5.16-2.328V3.05q0-.212.144-.356t.357-.144t.356.144t.143.356v.962q3.125.292 5.16 2.328t2.329 5.16h.961q.213 0 .356.144t.144.357t-.144.356t-.356.143h-.961q-.293 3.125-2.328 5.16q-2.036 2.036-5.161 2.329v.961q0 .213-.144.356t-.357.144t-.356-.144t-.143-.356M12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-4q-1.237 0-2.119-.881T9 12t.881-2.119T12 9t2.119.881T15 12t-.881 2.119T12 15"/></svg>
        </button>`,
      { position: 'topRight' }
    )

    control.getContainer().addEventListener('click', () => {
      if (navigator.geolocation) {
        clearMarkers()
        navigator.geolocation.getCurrentPosition((position) => {
          mapInstance.value.setCenter([
            position.coords.longitude,
            position.coords.latitude,
          ])

          mapInstance.value.setZoom(15)

          const marker = new mapgl.Marker(mapInstance.value, {
            coordinates: [position.coords.longitude, position.coords.latitude],
            icon: '/pin.svg',
          })

          markers.value.push(marker)
        })
      }
    })
  }

  if (!props.noActions) {
    mapInstance.value.on('click', (event) => {
      emit('update:center', event.lngLat)

      const coords = event.lngLat

      clearMarkers()

      const marker = new mapgl.Marker(mapInstance.value, {
        coordinates: coords,
        icon: '/pin.svg',
      })

      markers.value.push(marker)
    })
  }

  if (props.center?.length) {
    const marker = new mapgl.Marker(mapInstance.value, {
      coordinates: props.center,
      icon: '/pin.svg',
    })
  }
})
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
