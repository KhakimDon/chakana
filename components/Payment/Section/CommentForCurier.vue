<template>
  <PaymentCardInfo
    icon="SvgoProfileMessage"
    icon-class="!text-blue-100 !text-2xl"
    :title="comment ?? $t('courier_comment')"
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
}
defineProps<Props>()

interface Emits {
  (e: 'save', data: any): void
}
defineEmits<Emits>()
const showEdit = ref(false)
</script>
