<template>
  <BaseModal
    :model-value="modelValue"
    :has-back="isCartRoute"
    :title="$t('when_delivery')"
    @update:model-value="$emit('update:modelValue', $event)"
    @back="$emit('openSavedAddress')"
  >
    <BaseStepper
      v-if="isCartRoute"
      :steps="orderSteps"
      :step
      step-class="!w-full"
      class="!mb-5"
    />
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
        <p v-else>{{ interval }}</p>
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
import dayjs from 'dayjs'

import { orderSteps } from '~/data/stepper.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

interface Props {
  modelValue: boolean
  showFreeDelivery?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'openSavedAddress'): void
}>()

const route = useRoute()
const { t, locale } = useI18n()

const isCartRoute = computed(() => {
  return (
    route.path === `/${locale.value}/cart` ||
    route.path === `/${locale.value}/cart/`
  )
})

const selectedInterval = ref('nearest_half_hour')

function generateIntervals() {
  const now = new Date()
  const intervals = []

  let currentHour = now.getHours()
  let currentMinute = now.getMinutes()

  // Adjust to the next 2-hour interval
  if (currentMinute > 0) {
    currentHour += 3
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

function getCurrentDateTimeISO(date: any) {
  return date.format().slice(0, -6)
}

const modalStore = useModalStore()
const orderCartStore = useCartOrderStore()

function add() {
  if (selectedInterval.value === 'nearest_half_hour') {
    const now = dayjs()
    now.add(30, 'minutes')
    orderCartStore.orderDetail.when_to_deliver = getCurrentDateTimeISO(
      now.add(30, 'minutes')
    )
  } else {
    const now = dayjs()
    now.set('hours', Number(selectedInterval.value.split(':')[0]) + 24)
    orderCartStore.orderDetail.when_to_deliver = getCurrentDateTimeISO(
      now.set('hours', Number(selectedInterval.value.split(':')[0]) + 24)
    )
  }
  if (isCartRoute.value) {
    modalStore.userModel = true
  }
  emit('update:modelValue', false)
}

const intervals = ref()

onMounted(() => {
  intervals.value = ['nearest_half_hour', ...generateIntervals()]
})

const step = ref('when_to_deliver')
</script>
