<template>
  <div class="container flex-center h-screen">
    <div class="cursor-pointer" @click="ViewToast()">Open Toast a</div>
  </div>
</template>
<script setup lang="ts">
const { showToast } = useCustomToast()
function ViewToast() {
  showToast('Hello World', 'error')
}
</script>
