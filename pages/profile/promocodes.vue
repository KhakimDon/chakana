<template>
  <div>
    <CommonBack v-if="useMobile('mobile')" to="/profile" />
    <div class="flex-center-between mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('discounts_and_promocodes') }}
      </h1>
    </div>

    <!-- Enter promocode -->
    <div class="flex flex-col gap-5">
      <div class="bg-gray-300 max-md:-mx-4 p-4 sm:rounded-xl">
        <FormGroup class="!gap-1" :label="$t('enter_codeword')">
          <div class="flex flex-col md:flex-row gap-y-2 gap-x-4">
            <FormInput
              v-model="form.values.promocode"
              class="w-full !bg-white caret-orange"
              :class="{
                animated: form.$v.value.promocode.$error && animate,
              }"
              :error="form.$v.value.promocode.$error"
              input-class="placeholder:font-medium"
              :placeholder="$t('codeword')"
              @enter="applyPromocode"
              @animationend="handleAnimationEnd"
            />
            <BaseButton
              :text="$t('apply')"
              class="sm:!p-3 shrink-0"
              @click="applyPromocode"
            />
          </div>
        </FormGroup>
      </div>

      <div
        class="flex flex-col gap-3 bg-gray-300 max-sm:-mx-4 p-4 sm:rounded-xl"
      >
        <template v-if="promocodes?.loading">
          <ProfilePromocodesCardLoading v-for="key in 4" :key />
        </template>
        <template v-else-if="!promocodes?.loading && promocodes?.list.length">
          <ProfilePromocodesCard
            v-for="(promo, i) in promocodes.list"
            :key="i"
            :promo="promo"
          />
        </template>
        <template v-else>
          <CommonNoData class="col-span-4" />
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { required } from '@vuelidate/validators'

import { usePromocodesStore } from '~/store/profile/promocodes'
import { useCustomToast } from '~/composables/useCustomToast.js'

const { t } = useI18n()
const promocodesStore = usePromocodesStore()
const animate = ref(false)
const promocodes = computed(() => promocodesStore.promocodes)
const { showToast } = useCustomToast()
promocodesStore.fetchPromocodes()

const form = useForm(
  {
    promocode: '',
  },
  {
    promocode: { required },
  }
)

const loading = ref(false)
const applyPromocode = () => {
  form.$v.value.$touch()
  if (form.$v.value.$invalid) {
    animate.value = true
    return
  }

  loading.value = true
  promocodesStore
    .applyPromocode(form.values.promocode)
    .then(() => {
      useCustomToast().showToast(t('promocode_applied'), 'success')
      promocodesStore.promocodes.loading = true
      promocodesStore.fetchPromocodes()
      form.values.promocode = ''
      form.$v.value.$reset()
    })
    .catch((e) => {
      showToast(t(e._data?.detail?.code), 'error')
      animate.value = true
    })
    .finally(() => {
      loading.value = false
    })
}

const handleAnimationEnd = () => {
  animate.value = false
}
</script>

<style scoped>
@keyframes horizontal-shaking {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(5px);
  }
  50% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
}

.animated {
  animation: horizontal-shaking 0.4s ease-in-out;
}
</style>
