<template>
  <PaymentCardInfo
    icon="SvgoProfileClockLocation"
    icon-class="text-purple-500 !text-2xl"
    :title="text"
    :text-wrapper-class="textWrapperClass"
    @open-details="showEdit = true"
  />

  <OrderInfoEditTime
    v-model="showEdit"
    :default-info="defaultInfo"
    :is-auto="isAuto"
    @save="$emit('save', $event)"
  />
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

interface Props {
  defaultInfo?: any
  isAuto?: boolean
  textWrapperClass?: string
}
const props = defineProps<Props>()

defineEmits<{
  (e: 'save', value: any): void
}>()

const { t } = useI18n()

const showEdit = ref(false)

const text = computed(() => {
  return props.isAuto
    ? t('auto_order_time', {
        week: t(`weekday[${props.defaultInfo?.weekdays}]`),
        time: props.defaultInfo?.delivery_time,
      })
    : props.defaultInfo?.delivery_time === 'nearest_half_hour'
    ? t(props.defaultInfo?.delivery_time)
    : t(
        new Date(props.defaultInfo?.delivery_time).getDate() ===
          new Date().getDate()
          ? 'today_interval'
          : 'tomorrow_interval',
        { time: dayjs(props.defaultInfo?.delivery_time).format('HH:mm') }
      )
})
</script>
