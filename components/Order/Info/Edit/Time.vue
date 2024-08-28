<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('when_delivery')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <OrderInfoFormTime
      class="overflow-y-auto sm:max-h-96 max-h-[50vh] overflow-x-hidden"
      :form
      :is-auto="isAuto"
    />
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
      if (props.isAuto) {
        form.values.delivery_times = props.defaultInfo?.delivery_times
      } else {
        form.values.when_to_deliver = props.defaultInfo?.when_to_deliver
      }
      // form.values.weekdays = props.defaultInfo?.weekdays
    }
  }
)

function handleAddress() {
  emit('update:modelValue', false)
  emit('save', form.values)
}
</script>
