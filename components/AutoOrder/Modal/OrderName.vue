<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('auto_order_title')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <BaseStepper
        v-if="isCartRoute"
        :steps="$route?.query?.order === 'auto' ? autoOrderSteps : steps"
        :step
        step-class="!w-full"
        class="!mb-5 !scale-95"
      />
      <FormGroup :label="$t('name')">
        <FormInput
          v-model="form.values.name"
          :error="form.$v.value.name.$error"
          :placeholder="$t('enter_auto_order_title')"
        />
      </FormGroup>
      <BaseButton
        class="!py-3 w-full !mt-6"
        :loading
        :text="$t('save')"
        size="md"
        :disabled="form.$v.value.$invalid"
        @click="add"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'

import { autoOrderSteps, steps } from '~/data/stepper.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const modalStore = useModalStore()

const loading = ref(false)

const form = useForm(
  {
    name: '',
  },
  {
    name: { required, minLength: minLength(3) },
  }
)

const route = useRoute()
const { locale } = useI18n()

const isCartRoute = computed(() => {
  return (
    route.path === `/${locale.value}/cart` ||
    route.path === `/${locale.value}/cart/`
  )
})

const orderCartStore = useCartOrderStore()

function add() {
  form.$v.value.$touch()
  if (!form.$v.value.$invalid) {
    loading.value = true
    orderCartStore.autoOrderDetail.name = form.values.name
    loading.value = false
    if (isCartRoute.value) {
      modalStore.addressModel = true
    }
    emit('update:modelValue', false)
  }
}

watch(
  () => props.modelValue,
  () => {
    form.$v.value.$reset()
  }
)

const step = ref('name')

onMounted(() => {
  form.values.name = orderCartStore.autoOrderDetail.name
})
</script>
