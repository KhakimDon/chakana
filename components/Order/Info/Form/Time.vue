<template>
  <div class="space-y-4">
    <AutoOrderCardWeekdays
      v-if="isAuto"
      v-model="values.weekdays"
      class="!mt-5"
    />
    <p
      v-if="showFreeDelivery"
      class="text-xs font-semibold leading-none rounded-md text-dark bg-white-100 w-fit p-2"
    >
      {{ $t('free_delivery_badge') }}
    </p>
    <section class="max-h-96 overflow-y-auto space-y-4 md:pr-2">
      <div
        v-for="(interval, key) in intervals"
        :key
        class="flex-y-center cursor-pointer hover:text-orange transition-300 justify-between"
        :class="{
          'text-orange': selectedInterval === interval,
        }"
        @click="chooseTime(interval)"
      >
        <p v-if="key !== 0 || isAuto">
          {{ isAuto ? interval : $t('interval', { range: interval }) }}
        </p>
        <p v-else>{{ $t(interval) }}</p>
        <SvgoCommonCheck
          v-if="selectedInterval === interval"
          class="text-orange text-xl !mb-0"
        />
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'

import { generateOrderIntervals } from '~/components/Order/Info/Form/index.js'

interface Props {
  form: any
  showFreeDelivery?: boolean
  isAuto?: boolean
}
const props = defineProps<Props>()

// const emit = defineEmits<{}>()

const { values, $v } = unref(props.form)

const selectedInterval = ref(values?.delivery_time || 'nearest_2_hours')

function getCurrentDateTimeISO(date: any) {
  return date.format().slice(0, -6)
}

function chooseTime(interval: string) {
  selectedInterval.value = interval
  // if (selectedInterval.value === 'nearest_2_hours') {
  //   const now = dayjs()
  //   values.delivery_time = getCurrentDateTimeISO(now.add(2, 'hours'))
  // } else
  // if (props.isAuto) {
  values.delivery_time = selectedInterval.value
  // } else {
  //   const now = dayjs()
  //   values.delivery_time = getCurrentDateTimeISO(
  //     now
  //       .set('hours', Number(selectedInterval.value.split(':')[0]) + 24)
  //       .set('minute', 0)
  //       .set('second', 0)
  //   )
  // }
}

const intervals = ref()

onMounted(() => {
  intervals.value = generateOrderIntervals(props.isAuto)
  if (!props.isAuto) {
    intervals.value.unshift('nearest_2_hours')
  }
  if (!values?.delivery_time) {
    chooseTime(intervals.value[0])
  }
})
</script>
