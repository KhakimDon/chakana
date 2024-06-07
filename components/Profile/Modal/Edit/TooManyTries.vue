<template>
  <BaseModal
    :model-value="modelValue"
    no-header
    has-close
    wrapper-class="pt-14 flex flex-col items-center "
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div
      class="w-[90px] h-[90px] bg-orange rounded-full border-[3px] border-white/20 flex-center relative"
    >
      <SvgoCommonInfo
        class="text-[42px] leading-[42px] text-white relative z-10"
      />
      <div
        class="w-[78.4px] h-[78.4px] absolute top-3 left-1.5 right-1.5 opacity-60 bg-orange blur-[50px] z-0"
      />
    </div>
    <h2 class="text-center text-xl font-extrabold leading-130 text-dark mt-7">
      {{ $t('too_many_tries') }}
    </h2>
    <p
      class="text-sm font-normal leading-140 text-gray-100 mt-2 mb-5 text-center"
    >
      {{ $t('you_tried_code_verification_three_times') }}
    </p>
    <a
      :href="`tel:${CONFIG.CONTACT_PHONE}`"
      class="py-2 pl-3 pr-[18px] rounded-xl border border-gray-300 flex-y-center gap-3 relative overflow-hidden hover:border-orange hover:bg-orange/10 transition-300"
    >
      <span
        class="w-8 h-8 rounded-full bg-orange flex-center text-xl leading-5"
      >
        <SvgoCommonPhone class="text-white" />
      </span>
      <p class="text-base font-semibold leading-140 text-dark">
        {{ formatPhoneNumber(CONFIG.CONTACT_PHONE) }}
      </p>
      <span
        class="w-2 h-6 rounded-full bg-orange absolute -left-1 top-1/2 -translate-x-px -translate-y-1/2"
      ></span>
    </a>
    <p class="text-sm font-normal leading-140 text-gray-100 mt-2">
      {{ $t('phone_number_contact_support') }}
    </p>
  </BaseModal>
</template>
<script setup lang="ts">
import { CONFIG } from '../../../../config/index.js'
import { formatPhoneNumber } from '../../../../utils/functions/common.js'

interface Props {
  modelValue: boolean
}
defineProps<Props>()

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const emit = defineEmits<Emits>()
</script>
