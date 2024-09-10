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
        per_week: props.defaultInfo.delivery_times?.length,
      })
    : props.defaultInfo?.when_to_deliver === 'nearest_half_hour'
    ? t(props.defaultInfo?.when_to_deliver)
    : t(
        new Date(props.defaultInfo?.when_to_deliver).getDate() ===
          new Date().getDate()
          ? 'today_interval'
          : 'tomorrow_interval',
        { time: dayjs(props.defaultInfo?.when_to_deliver).format('HH:mm') }
      )
})
</script>
