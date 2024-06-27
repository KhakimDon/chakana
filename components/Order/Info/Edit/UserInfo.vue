<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('recipient_details')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <OrderInfoFormUserInfo :form />
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
  defaultInfo?: any
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: any): void
}>()

const form = useForm(props.defaultInfo, {
  full_name: { required },
  phone: { required },
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
