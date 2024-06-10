<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('payment_method')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <CommonPaymentTypes v-model="paymentType" />
      <BaseButton
        class="!py-3 w-full !mt-6"
        :loading
        :text="$t('save')"
        size="md"
        @click="add"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const loading = ref(false)

const paymentType = ref('paylov')

const form = useForm(
  {
    name: '',
    phone: '',
  },
  {
    name: { required, minLength: minLength(3) },
    phone: { required },
  }
)

function add() {
  form.$v.value.$touch()
  if (!form.$v.value.$invalid) {
    loading.value = true
    // API call here
  }
}

watch(
  () => props.modelValue,
  () => {
    form.$v.value.$reset()
  }
)
</script>
