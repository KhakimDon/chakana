<template>
  <div class="flex-y-center overflow-x-auto pb-3 gap-2">
    <div v-if="weekdaysLoading">
      <span
        class="shimmer bg-white-100 w-5 rounded-md px-2 py-1.5 space-y-3"
      ></span>
    </div>
    <span
      v-for="(weekday, key) in weekdays"
      :key
      class="px-2 py-1.5 cursor-pointer border border-transparent bg-white-100 rounded-md text-xs font-semibold leading-none"
      :class="{
        '!text-orange !bg-white !border-orange': selectedWeekday === weekday.id,
      }"
      @click="orderCartStore.autoOrderDetail.weekday = weekday.id"
    >
      {{ weekday?.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'

const orderCartStore = useCartOrderStore()

const weekdays = computed(() => orderCartStore.weekdays.list)
const weekdaysLoading = computed(() => orderCartStore.weekdays.loading)

const selectedWeekday = computed(() => orderCartStore.autoOrderDetail.weekday)

onMounted(() => {
  orderCartStore.getWeekdaysList()
})
</script>

<style scoped></style>
