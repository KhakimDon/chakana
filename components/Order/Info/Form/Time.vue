<template>
  <div class="space-y-4">
    <AutoOrderCardWeekdays
      v-if="isAuto"
      v-model="weekday"
      :delivery-times="values.delivery_times"
    />
    <p
      v-if="showFreeDelivery"
      class="text-xs font-semibold leading-none rounded-md text-dark bg-white-100 w-fit p-2"
    >
      {{ $t('free_delivery_badge') }}
    </p>
    <section class="md:pr-2 flex flex-col -mr-5 md:-mr-7">
      <div
        v-for="(interval, key) in intervals"
        :key
        class="flex-y-center cursor-pointer hover:text-orange transition-300 justify-between py-[14px] border-y-[0.5px] border-white-100 first:border-t last:border-b-0 text-sm font-semibold leading-130 pr-5 md:pr-7"
        :class="{
          'text-orange': isActiveInterval(interval, key),
        }"
        @click="chooseTime(isAuto || key === 0 ? interval : interval.time)"
      >
        <p v-if="key !== 0 || isAuto">
          {{
            isAuto
              ? interval
              : $t(
                  new Date(interval.time).getDate() === new Date().getDate()
                    ? 'today_interval'
                    : 'tomorrow_interval',
                  { time: interval.time_text }
                )
          }}
        </p>
        <p v-else>{{ $t(interval) }}</p>
        <div class="w-5 h-5 flex-center">
          <Transition name="fade-fast" mode="out-in">
            <SvgoCommonCheck
              v-if="isActiveInterval(interval, key)"
              class="text-orange text-xl !mb-0"
            />
          </Transition>
        </div>
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

const { values, $v } = unref(props.form)

const isActiveInterval = (
  interval: string | { time: string; time_text: string },
  index: number
) => {
  if ((props.isAuto && typeof interval === 'string') || index === 0) {
    return (
      interval === activeInterval.value ||
      interval.substring(0, 5) === activeInterval.value
    )
  } else {
    return interval.time === activeInterval.value
  }
}

const weekday = ref()

const selectedInterval = ref(values?.delivery_times || 'nearest_half_hour')

const activeInterval = computed(() => {
  if (props.isAuto && values.delivery_times?.length) {
    return values.delivery_times?.find((item) => item.weekday === weekday.value)
      ?.delivery_time
  }
  return values.when_to_deliver
})

function chooseTime(interval: string) {
  selectedInterval.value = interval
  if (props.isAuto) {
    const index = values.delivery_times?.findIndex(
      (item) => item.weekday === weekday.value
    )
    if (index > -1) {
      values.delivery_times[index].delivery_time = interval
    } else {
      if (!values.delivery_times?.length) {
        values.delivery_times = []
      }
      values.delivery_times?.push({
        delivery_time: interval,
        weekday: weekday.value,
      })
    }
  } else {
    values.when_to_deliver = selectedInterval.value
  }
}

const intervals = ref()
onMounted(() => {
  intervals.value = generateOrderIntervals(props.isAuto, dayjs)
  if (!props.isAuto) {
    intervals.value.unshift('nearest_half_hour')
  }
  if (!values?.when_to_deliver && !props.isAuto) {
    chooseTime(intervals.value[0])
  }
})
</script>
