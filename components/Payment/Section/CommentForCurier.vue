<template>
  <PaymentCardInfo
    icon="SvgoProfileMessage"
    icon-class="!text-blue-100 !text-2xl"
    :title="comment || isPicker ? $t('picker_comment') : $t('courier_comment')"
    :subtitle
    @open-details="showEdit = true"
  />
  <OrderInfoEditComment
    v-model="showEdit"
    :default-info="{ comment_to_courier: comment }"
    @save="$emit('save', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  comment: string
  subtitle?: string
  isPicker?: boolean
}
defineProps<Props>()

interface Emits {
  (e: 'save', data: any): void
}
defineEmits<Emits>()
const showEdit = ref(false)
</script>
