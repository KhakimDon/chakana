<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('address_delivery')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <OrderInfoFormAddress
      :form
      :default-id="defaultId"
      @change-address="changeAddress"
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
import { useAddressStore } from '~/store/address.js'

interface Props {
  modelValue: boolean
  defaultId?: string
}
const props = defineProps<Props>()
const addressStore = useAddressStore()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: any): void
}>()

const form = useForm({
  id: props.defaultId,
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.values.id = props.defaultId
    }
  }
)

function handleAddress() {
  emit('update:modelValue', false)
  emit('save', form.values)
  addressStore.savedAddress = selectedAddress.value
}

const selectedAddress = ref({})

function changeAddress(item: any) {
  selectedAddress.value = item
}
</script>
