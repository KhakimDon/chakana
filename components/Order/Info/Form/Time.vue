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
          'text-orange':
            selectedInterval === interval ||
            selectedInterval === interval.substring(0, 5),
        }"
        @click="chooseTime(interval)"
      >
        <p v-if="key !== 0 || isAuto">
          {{
            isAuto
              ? interval
              : $t(
                  new Date(interval).getDate() === new Date().getDate()
                    ? 'today_interval'
                    : 'tomorrow_interval',
                  { time: dayjs(interval).format('HH:mm') }
                )
          }}
        </p>
        <p v-else>{{ $t(interval) }}</p>
        <SvgoCommonCheck
          v-if="
            selectedInterval === interval ||
            selectedInterval === interval.substring(0, 5)
          "
          class="text-orange text-xl !mb-0"
        />
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'

import {
  generateOrderIntervals,
  generateOrderTomorrowIntervals,
} from '~/components/Order/Info/Form/index.js'

interface Props {
  form: any
  showFreeDelivery?: boolean
  isAuto?: boolean
}
const props = defineProps<Props>()

const { values, $v } = unref(props.form)

const selectedInterval = ref(values?.delivery_time || 'nearest_2_hours')

function chooseTime(interval: string) {
  selectedInterval.value = interval
  values.delivery_time = selectedInterval.value
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
