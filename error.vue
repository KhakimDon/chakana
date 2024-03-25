<template>
  <div>
    <h1>Error: {{ error.statusCode }}</h1>
    <pre>{{ error }}</pre>
  </div>
</template>
<script setup lang="ts">
interface Props {
  error: any
}
defineProps<Props>()
</script>
