<template>
  <BaseModal
    :model-value="modelValue"
    :has-back="isCartRoute"
    :title="addNew ? $t('new_promo') : $t('promo_code')"
    @update:model-value="$emit('update:modelValue', $event)"
    @back="backToList"
  >
    <BaseStepper
      v-if="isCartRoute"
      :steps="$route?.query?.order === 'auto' ? autoOrderSteps : orderSteps"
      :step
      step-class="!w-full"
      class="!mb-5"
      :class="$route?.query?.order === 'auto' ? '!scale-90' : ''"
    />
    <div class="space-y-4">
      <FormGroup v-if="addNew" :label="$t('enter_code')">
        <FormInput
          v-model="form.values.code"
          :error="form.$v.value.code.$error || isInvalidPromoCode"
          :placeholder="$t('code')"
        />
      </FormGroup>
      <div
        v-else-if="promoCodes?.list?.length && !promoCodes?.loading"
        class="space-y-3 max-h-96 overflow-y-auto md:pr-3"
      >
        <div
          v-for="(promo, index) in promoCodes?.list"
          :key="index"
          class="border border-white-100 rounded-md p-1 cursor-pointer"
          @click="choosePromo(promo?.id)"
        >
          <div
            class="flex-y-center gap-2 justify-between py-3 select-none px-2"
          >
            <p class="text-sm font-bold leading-130 text-dark">
              {{ promo?.code }}
            </p>
            <div class="flex-y-center justify-end gap-2">
              <p class="text-green text-xs font-medium leading-none">
                {{ dayjs(promo?.expire).format('DD.MM.YYYY') }}
              </p>
              <FormRadio
                v-if="selected === promo?.id"
                class="!p-0 max-w-[20px]"
              />
              <FormRadio v-else value="true" class="!p-0 max-w-[20px]" />
            </div>
          </div>
          <i18n-t
            keypath="active_price"
            tag="p"
            class="bg-white-100 p-2 rounded text-xs text-gray-100 font-medium leading-none w-full"
          >
            <template #price>
              <span class="text-xs font-bold leading-none text-dark">
                {{ formatMoneyDecimal(promo?.discount ?? 0, 0) }}
                <span class="text-[10px] font-bold text-dark leading-[13px]">
                  UZS
                </span>
              </span>
            </template>
          </i18n-t>
        </div>
      </div>
      <div v-else-if="promoCodes?.loading" class="space-y-2">
        <ProfilePromocodesCardLoading v-for="key in 4" :key />
      </div>
      <div v-else class="flex items-center justify-center">
        <p class="text-center text-sm text-gray-500">
          {{ $t('no_promo_codes_yet') }}
        </p>
      </div>
      <BaseButton
        v-if="!addNew"
        class="!py-3 w-full"
        variant="secondary"
        :text="$t('apply_new_promo_code')"
        size="md"
        @click="addNew = true"
      >
        <template #suffix>
          <SvgoCommonChevron class="rotate-180" />
        </template>
      </BaseButton>
      <BaseButton
        class="!py-3 w-full !mt-6"
        :loading
        :text="addNew ? $t('save') : $t('confirm')"
        size="md"
        @click="addNew ? apply() : confirmPromoCode()"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import { autoOrderSteps, orderSteps } from '~/data/stepper.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirmPromoCode', value: string): void
}>()

const route = useRoute()
const { locale } = useI18n()

const isCartRoute = computed(() => {
  return (
    route.path === `/${locale.value}/cart` ||
    route.path === `/${locale.value}/cart/`
  )
})

const addNew = ref(false)

const cartOrderStore = useCartOrderStore()

const promoCodes = computed(() => cartOrderStore.promoCodes)
const isInvalidPromoCode = computed(() => cartOrderStore.isInvalidPromoCode)

const form = useForm(
  {
    code: '',
  },
  {
    code: { required, minLength: minLength(3) },
  }
)

const modalStore = useModalStore()

const backToList = () => {
  if (addNew.value) {
    modalStore.promoModel = true
    addNew.value = false
  } else {
    modalStore.promoModel = false
    modalStore.commentModel = true
  }
}

const loading = computed(() => cartOrderStore.applyingPromoCode)
function apply() {
  form.$v.value.$touch()
  if (!form.$v.value.$invalid) {
    cartOrderStore.applyPromoCode(form.values.code).then(() => {
      addNew.value = false
      selected.value = ''
      cartOrderStore.getPromoCodeList()
    })
  }
}

watch(
  () => props.modelValue,
  () => {
    form.$v.value.$reset()
  }
)

watch(
  () => props.modelValue,
  (val) => {
    if (val && !promoCodes.value?.list?.length) {
      cartOrderStore.getPromoCodeList()
    } else if (!val) {
      form.$v.value.$reset()
      addNew.value = false
    }
  }
)

const selected = ref()
const choosePromo = (promoId: string) => {
  selected.value = promoId
}

const confirmPromoCode = () => {
  if (isCartRoute.value) {
    modalStore.paymentModel = true
  }
  emit('confirmPromoCode', selected.value)
  selected.value = ''
}

const step = ref('promo')
</script>
