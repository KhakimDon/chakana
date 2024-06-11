<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('when_delivery')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <p
        v-if="showFreeDelivery"
        class="text-xs font-semibold leading-none rounded-md text-dark bg-white-100 w-fit p-2"
      >
        {{ $t('free_delivery_badge') }}
      </p>
      <div
        v-for="(interval, key) in intervals"
        :key
        class="flex-y-center cursor-pointer hover:text-orange transition-300 justify-between"
        :class="{
          'text-orange': selectedInterval === interval,
        }"
        @click="selectedInterval = interval"
      >
        <p v-if="key !== 0">{{ t('interval', { range: interval }) }}</p>
        <p v-else>{{ $t(interval) }}</p>
        <SvgoCommonCheck
          v-if="selectedInterval === interval"
          class="text-orange text-xl !mb-0"
        />
      </div>
      <BaseButton
        class="!py-3 w-full !mt-6"
        :loading
        :text="$t('confirm')"
        size="md"
        @click="add"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'

interface Props {
  modelValue: boolean
  showFreeDelivery?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()

const selectedInterval = ref('nearest_2_hours')

function generateIntervals() {
  const now = new Date()
  const intervals = []

  let currentHour = now.getHours()
  let currentMinute = now.getMinutes()

  // Adjust to the next 2-hour interval
  if (currentMinute > 0) {
    currentHour += 1
  }
  currentHour -= currentHour % 2
  currentMinute = 0

  while (currentHour < 24) {
    const startInterval = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      currentHour,
      currentMinute
    )
    const endInterval = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      currentHour + 1,
      currentMinute
    )
    intervals.push(
      `${startInterval.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })} - ${endInterval.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`
    )
    currentHour += 1
  }

  return intervals
}

function convertTimeTo12HourFormat(time: string) {
  // Splitting the time string into hours and minutes
  const timeArray = time.split(':')
  let hours = parseInt(timeArray[0])

  // Converting hours to 12-hour format
  hours = hours % 12
  hours = hours || 12 // 0 should be converted to 12

  return hours
}

const orderCartStore = useCartOrderStore()
function add() {
  if (selectedInterval.value === 'nearest_2_hours') {
    const now = new Date()
    now.setHours(now.getHours() + 3)
    orderCartStore.orderDetail.when_to_deliver = now
  } else {
    const now = new Date()
    now.setHours(
      convertTimeTo12HourFormat(selectedInterval.value.split('-')[0]) + 2
    )
    now.setMinutes(0)
    now.setSeconds(0)
    orderCartStore.orderDetail.when_to_deliver = now
  }
  emit('update:modelValue', false)
}

const intervals = ref()

onMounted(() => {
  intervals.value = ['nearest_2_hours', ...generateIntervals()]
})
</script>
