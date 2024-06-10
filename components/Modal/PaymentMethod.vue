<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('payment_method')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div>
      <div
        class="flex-y-center gap-1 select-none cursor-pointer"
        @click="courierCard = !courierCard"
      >
        <SvgoProfileUser class="text-orange text-2xl" />
        <div
          class="flex-y-center gap-1 border-b border-white-100 justify-between w-full"
        >
          <p class="text-sm font-semibold leading-tight text-dark">
            {{ $t('courier_card') }}
          </p>
          <FormRadio v-if="!courierCard" v-model="courierCard" />
          <FormRadio v-else />
        </div>
      </div>
      <div
        class="flex-y-center gap-1 select-none cursor-pointer"
        @click="cash = !cash"
      >
        <SvgoProfileMoney class="text-green text-2xl" />
        <div
          class="flex-y-center gap-1 border-b border-white-100 justify-between w-full"
        >
          <p class="text-sm font-semibold leading-tight text-dark">
            {{ $t('cash') }}
          </p>
          <FormRadio v-if="!cash" v-model="cash" />
          <FormRadio v-else />
        </div>
      </div>
      <PaymentCardInfo
        v-if="false"
        icon="SvgoProfileCard"
        icon-class="!text-blue-100 !text-2xl"
        :title="$t('payment_via_card')"
        @open-details="() => {}"
      />
      <div class="flex-y-center gap-1 my-4">
        <SvgoProfileCoins class="text-orange text-2xl" />
        <p class="text-sm font-semibold leading-tight text-dark">
          {{ $t('payment_system') }}
        </p>
      </div>
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
const courierCard = ref(false)
const cash = ref(false)

watch(
  () => cash.value,
  (val) => {
    if (val) {
      courierCard.value = false
    }
  }
)

watch(
  () => courierCard.value,
  (val) => {
    if (val) {
      cash.value = false
    }
  }
)

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
