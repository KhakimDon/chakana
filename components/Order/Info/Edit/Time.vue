<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('when_delivery')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <OrderInfoFormTime :form :is-auto="isAuto" />
    <BaseButton
      class="!py-3 w-full !mt-6"
      :text="$t('save')"
      size="md"
      @click="handleAddress"
    />
  </BaseModal>
</template>
<script setup lang="ts">
import { required } from '@vuelidate/validators'

interface Props {
  modelValue: boolean
  isAuto?: boolean
  defaultInfo?: any
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: any): void
}>()

const form = useForm(
  props.defaultInfo || {
    delivery_time: '',
    weekdays: null,
  },
  {
    delivery_time: { required },
  }
)

watch(
  () => props.modelValue,
  (val) => {
    if (val && props.defaultInfo) {
      form.values.delivery_time = props.defaultInfo?.delivery_time
      form.values.weekdays = props.defaultInfo?.weekdays
    }
  }
)

function handleAddress() {
  emit('update:modelValue', false)
  emit('save', form.values)
}
</script>
