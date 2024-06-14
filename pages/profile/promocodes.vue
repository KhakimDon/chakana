<template>
  <div>
    <div class="flex-center-between mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('discounts_and_promocodes') }}
      </h1>
    </div>

    <!-- Enter promocode -->
    <div class="flex flex-col gap-5">
      <div class="bg-gray-300 p-4 rounded-xl">
        <FormGroup class="!gap-1" :label="$t('enter_codeword')">
          <div class="flex flex-col md:flex-row gap-4">
            <FormInput
              v-model="form.values.promocode"
              class="w-full mr-3 !bg-white caret-orange"
              :class="{
                animated:
                  (form.$v.value.promocode.$error || !applyResult.success) &&
                  animate,
              }"
              :error="form.$v.value.promocode.$error || !applyResult.success"
              input-class="placeholder:font-medium"
              :placeholder="$t('codeword')"
              @enter="applyPromocode"
              @animationend="handleAnimationEnd"
            />
            <BaseButton
              :text="$t('apply')"
              class="!p-3"
              @click="applyPromocode"
            />
          </div>
        </FormGroup>
      </div>

      <div class="flex flex-col gap-3 bg-gray-300 p-4 rounded-xl">
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

const promocodesStore = usePromocodesStore()
const animate = ref(false)
const applyResult = computed(() => promocodesStore.applyResult)
const promocodes = computed(() => promocodesStore.promocodes)

promocodesStore.fetchPromocodes()

const form = useForm(
  {
    promocode: '',
  },
  {
    promocode: { required },
  }
)

const applyPromocode = () => {
  form.$v.value.$touch()
  if (form.$v.value.$invalid) {
    animate.value = true
    return
  }

  promocodesStore.applyPromocode(form.values.promocode)

  if (!applyResult.value.success) {
    animate.value = true
  }
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
