<template>
  <div></div>
</template>

<script setup lang="ts">
// need a function can detect ios or android and redirect to the app store or play store
function redirectToAppStore() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  const isAndroid = /Android/.test(navigator.userAgent)
  if (isIOS) {
    window.location.href =
      'https://apps.apple.com/uz/app/xolodilnik/id6499511120'
  } else if (isAndroid) {
    window.location.href =
      'https://play.google.com/store/apps/details?id=org.uicgroup.xolodilnikapp '
  } else {
    window.location.href = 'https://xolodilnik.uz'
  }
}

onMounted(() => {
  if (process.client) {
    redirectToAppStore()
  }
})
</script>

<style scoped></style>
