<template>
  <main>
    <section>
      <div id="map"></div>
    </section>
  </main>
</template>

<script setup>
import { load } from '@2gis/mapgl'
import { Directions } from '@2gis/mapgl-directions'
import { onBeforeMount, ref } from 'vue'

const mapInstance = ref(null)
const polygon = ref(null)
const route = ref(null)
const positionUser = ref([])
const markers = ref([])
const pointsCoords = ref([])

const borders = [
  [76.894503, 43.073294],
  [76.84423, 43.102158],
  [76.787826, 43.109858],
  [76.721837, 43.150053],
  [76.680522, 43.261732],
  [76.720838, 43.34254],
  [76.807978, 43.370218],
  [76.898194, 43.365731],
  [77.015064, 43.382183],
  [77.039147, 43.378321],
  [77.063077, 43.351363],
  [77.065892, 43.311803],
  [77.062925, 43.292763],
  [77.073653, 43.271211],
  [77.052198, 43.229064],
  [77.018177, 43.079992],
  [76.960933, 43.078925],
]

function createPolygon() {
  polygon.value = new mapgl.Polygon(mapInstance.value, {
    coordinates: [borders],
    color: '#C4C4C41A',
    strokeWidth: 3,
    strokeColor: '#C90B0B',
  })

  clickedMapRoute()
}

function successGeolocation(response) {
  positionUser.value = [response.coords.longitude, response.coords.latitude]
}

function errorGeolocation(error) {
  console.log(error)
}

function defineCurrentPosition() {
  const options = {
    maximumAge: 2500,
    timeout: 3000,
    enableHighAccuracy: true,
    zIndex: 1,
  }

  navigator.geolocation.getCurrentPosition(
    successGeolocation,
    errorGeolocation,
    options
  )
}

function clickedMapRoute() {
  route.value = new Directions(mapInstance.value, {
    directionsApiKey: '8cb11102-41de-47f7-bcae-5d84413eb06f',
  })

  polygon.value.on('click', (event) => {
    console.log('event >>>', event?.lngLat)

    const coords = event.lngLat

    if (markers.value.length < 2) {
      const marker = new mapgl.Marker(mapInstance.value, {
        coordinates: [76.91519296137145, 43.23733180569719],
        icon: 'https://docs.2gis.com/img/dotMarker.svg',
      })

      markers.value.push(marker)
      pointsCoords.value.push(coords)
    }

    // if (markers.value.length === 2) {
    //   route.value.carRoute({
    //     points: pointsCoords.value,
    //   });

    //   markers.value.forEach(marker => {
    //     marker.destroy();
    //   });
    // }
  })
}

load().then((mapglAPI) => {
  mapInstance.value = new mapglAPI.Map('map', {
    center: positionUser.value,
    zoom: 15,
    key: '8cb11102-41de-47f7-bcae-5d84413eb06f',
  })

  createPolygon()
})

onBeforeMount(() => {
  defineCurrentPosition()
})
</script>

<style scoped>
#map {
  width: 100vw;
  height: 85vh;
}
</style>
