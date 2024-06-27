<template>
  <div class="space-y-4">
    <div v-if="promoCodes?.loading" class="space-y-2">
      <ProfilePromocodesCardLoading v-for="key in 4" :key />
    </div>
    <div
      v-else-if="promoCodes?.list?.length"
      class="space-y-3 max-h-96 overflow-y-auto md:pr-3"
    >
      <div
        v-for="(promo, index) in promoCodes?.list"
        :key="index"
        class="border border-white-100 rounded-md p-1 cursor-pointer"
        @click="choosePromoCode(promo)"
      >
        <div class="flex-y-center gap-2 justify-between py-3 select-none px-2">
          <p class="text-sm font-bold leading-130 text-dark">
            {{ promo?.code }}
          </p>
          <div class="flex-y-center justify-end gap-2">
            <p class="text-green text-xs font-medium leading-none">
              {{ dayjs(promo?.expire).format('DD.MM.YYYY') }}
            </p>
            <FormRadio
              v-if="values.promo_code_id === promo?.id"
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
    <div v-else class="flex items-center justify-center">
      <p class="text-center text-sm text-gray-500">
        {{ $t('no_promo_codes_yet') }}
      </p>
    </div>
    <BaseButton
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
    <BaseModal v-model="addNew" :title="$t('new_promo')">
      <FormGroup :label="$t('enter_code')">
        <FormInput
          v-model="promoCodeForm.values.code"
          :error="promoCodeForm.$v.value.code.$error || isInvalidPromoCode"
          :placeholder="$t('code')"
        />
      </FormGroup>

      <BaseButton
        class="!py-3 w-full !mt-6"
        :loading
        :text="$t('confirm')"
        size="md"
        @click="apply"
      />
    </BaseModal>
  </div>
</template>
<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import { useCartOrderStore } from '~/store/cart_order.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  form: any
}
const props = defineProps<Props>()

const { values, $v } = unref(props.form)

const addNew = ref(false)

const cartOrderStore = useCartOrderStore()

function choosePromoCode(promo: any) {
  values.promo_code_id = promo?.id
  values.promo_info = promo
}

const promoCodes = computed(() => cartOrderStore.promoCodes)

cartOrderStore.getPromoCodeList()
const isInvalidPromoCode = computed(() => cartOrderStore.isInvalidPromoCode)

const promoCodeForm = useForm(
  {
    code: '',
  },
  {
    code: { required, minLength: minLength(3) },
  },
  { $stopPropagation: true }
)

const loading = computed(() => cartOrderStore.applyingPromoCode)
function apply() {
  promoCodeForm.$v.value.$touch()
  if (!promoCodeForm.$v.value.$invalid) {
    cartOrderStore.applyPromoCode(promoCodeForm.values.code).then(() => {
      values.promo_code_id = ''
      cartOrderStore.getPromoCodeList()
    })
  }
}

watch(addNew, (val) => {
  if (!val) promoCodeForm.$v.value.$reset()
})
</script>
