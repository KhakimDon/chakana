<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('courier_comment')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <OrderInfoFormName :form />
    <BaseButton
      class="!py-3 w-full !mt-6"
      :text="$t('save')"
      size="md"
      @click="handleAddress"
    />
  </BaseModal>
</template>
<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'

interface Props {
  modelValue: boolean
  defaultInfo?: any
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: any): void
}>()

const form = useForm(props.defaultInfo, {
  name: { required, minLength: minLength(3) },
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.values = props.defaultInfo
    }
  }
)

function handleAddress() {
  emit('update:modelValue', false)
  emit('save', form.values)
}
</script>
