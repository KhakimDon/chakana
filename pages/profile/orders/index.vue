<template>
  <div class="grid grid-cols-3 gap-4">
    <template v-if="orders.loading">
      <ProfileOrderCardLoading v-for="i in 6" :key="i" />
    </template>
    <template v-else-if="orders.list.length">
      <ProfileOrderCard
        v-for="item in orders.list"
        :key="item.id"
        :item="item"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useOrderStore } from '~/store/profile/orders.js'

const orderStore = useOrderStore()

const orders = computed(() => orderStore.orders)
orderStore.fetchOrders()
</script>
