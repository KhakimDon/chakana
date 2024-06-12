<template>
  <div class="flex gap-4" @mouseleave="hoveredItem = 0">
    <SvgoCommonStar
      v-for="i in 5"
      :key="i"
      class="text-[48px] leading-[48px] cursor-pointer transition-300 flex-center"
      :class="[starColor(i), iconClass]"
      :data-star-index="i"
      @mouseenter="hoveredItem = i"
      @click="pick(i)"
    >
    </SvgoCommonStar>
  </div>
</template>
<script setup lang="ts">
interface Props {
  modelValue: number
  error?: boolean
  iconClass?: string
}
const props = defineProps<Props>()

interface Emits {
  (e: 'update:modelValue', val: number): void
}
const emit = defineEmits<Emits>()

const rate = ref(0)
rate.value = unref(props.modelValue)
// watch(
//   () => props.modelValue,
//   (newValue) => {
//     if (newValue !== rate.value) rate.value = newValue
//   },
//   { immediate: true }
// )

const hoveredItem = ref(0)

const pick = (val: number) => {
  if (val === 1 && rate.value === 1) {
    val = 0
  }
  rate.value = val
  emit('update:modelValue', val)
}

const starColor = (index: number) => {
  return !!hoveredItem.value && hoveredItem.value >= index
    ? 'text-orange/90'
    : !hoveredItem.value && rate.value >= index
    ? 'text-orange'
    : 'text-gray-200'
}
</script>
