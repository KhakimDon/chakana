<template>
  <div>
    <CommonLoading v-if="loading" />
    <CommonStatusModal
      v-model="show"
      :is-paid="status?.is_paid"
      :state="status?.state"
      :type="status?.type"
    />
  </div>
</template>

<script setup lang="ts">
const loading = ref(true)
const route = useRoute()
const show = ref(false)

const status = ref('')

function getStatus() {
  useApi()
    .$get(`/payment/status/${route.query?.transaction_id}`)
    .then((res) => {
      status.value = res
    })
    .finally(() => {
      loading.value = false
      show.value = true
    })
}

getStatus()
</script>

<style scoped></style>
