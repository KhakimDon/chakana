<template>
  <div class="grid grid-cols-2 gap-3">
    <button
      v-for="i in paymentTypes"
      :key="i"
      type="button"
      class="rounded-lg bg-white-100 border border-gray-200 p-3 pr-[14px] w-full flex items-center justify-between transition-300"
      :class="{ '!border-violet !bg-white': modelValue === i }"
      @click="$emit('update:modelValue', i)"
    >
      <img
        class="max-h-7"
        :src="`/images/svg/payment/payment_${i}.svg`"
        :alt="i"
      />
      <span class="flex-y-center gap-1">
        <span
          class="h-5 w-fit px-[6px] text-xs bg-gray-200 rounded flex-center font-semibold text-dark leading-[15px]"
          >{{ 12 }}%</span
        >
        <span
          :class="{
            '!border-orange !bg-orange after:!bg-white': modelValue === i,
          }"
          class="block rounded-full w-5 h-5 border-2 border-gray-200 bg-white gender-radio relative transition-300 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:w-2.5 after:h-2.5 after:rounded-full after:bg-transparent"
        />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}
defineProps<Props>()

defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()
const paymentTypes = ['paylov', 'click', 'uzum', 'payme', 'xazna', 'plum']
</script>
