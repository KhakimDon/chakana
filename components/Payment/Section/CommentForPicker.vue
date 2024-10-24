<template>
  <PaymentCardInfo
    :subtitle="form?.picker_comment"
    :title="$t('picker_comment')"
    icon="SvgoProfileMessage"
    icon-class="!text-blue-100 !text-2xl"
    @open-details="showEdit = true"
  />
  <OrderInfoEditPicker
    v-model="showEdit"
    :default-info="form"
    @save="$emit('save', $event)"
  />
</template>

<script lang="ts" setup>
interface Props {
  form: {
    picker_comment: string
  }
  subtitle?: string
}

defineProps<Props>()

interface Emits {
  (e: 'save', data: any): void
}

defineEmits<Emits>()
const showEdit = ref(false)
</script>
