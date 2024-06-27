<template>
  <PaymentCardInfo
    icon="SvgoProfileClockLocation"
    icon-class="text-purple-500 !text-2xl"
    :title="whenDelivery"
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
interface Props {
  defaultInfo?: any
  isAuto?: boolean
}
const props = defineProps<Props>()

defineEmits<{
  (e: 'save', value: any): void
}>()

const showEdit = ref(false)

const whenDelivery = computed(() => {
  return props.defaultInfo?.delivery_time
})
</script>
