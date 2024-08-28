<template>
  <div class="flex-y-center overflow-x-auto gap-2 !pt-2">
    <div v-if="weekdaysLoading">
      <span
        class="shimmer bg-white-100 w-5 rounded-md px-2 py-1.5 space-y-3"
      ></span>
    </div>
    <span
      v-for="(weekday, key) in weekdays"
      :key
      class="px-2 py-1.5 cursor-pointer border border-transparent bg-white-100 rounded-md text-xs font-semibold leading-none relative after:transition-opacity after:duration-200 after:absolute after:-top-0.5 after:-right-0.5 after:w-2 after:h-2 after:rounded-full after:bg-orange"
      :class="{
        '!text-orange !bg-white !border-orange': modelValue === weekday.id,
        'after:opacity-0': !isSelected(weekday.id) || modelValue === weekday.id,
      }"
      @click="emit('update:modelValue', weekday.id)"
    >
      {{ weekday?.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'

interface Props {
  modelValue: string
  deliveryTimes: any
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const orderCartStore = useCartOrderStore()

const weekdays = computed(() => orderCartStore.weekdays.list)
const weekdaysLoading = computed(() => orderCartStore.weekdays.loading)

const isSelected = (id: number) => {
  return !!props.deliveryTimes?.find((item) => item.weekday === id)
}

onMounted(() => {
  orderCartStore.getWeekdaysList().then(() => {
    if (!props.modelValue) {
      emit('update:modelValue', orderCartStore.weekdays.list[0].id)
    }
  })
})
</script>
