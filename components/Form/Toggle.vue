<template>
  <label
    class="transition duration-200 ease-in-out inline-flex items-center border w-11 h-[25px] relative rounded-[50px] cursor-pointer p-0.5 shrink-0"
    :class="value ? 'bg-green border-green' : 'border-gray-200 bg-gray-200'"
  >
    <input
      :checked="value"
      type="checkbox"
      class="absolute w-px h-px opacity-0"
      @change="handleChange"
    />
    <span
      class="absolute w-5 h-5 rounded-full transition duration-200 ease-in-out bg-white shadow-[0_3px_1px_0_#0000000A,0_3px_8px_0_#0000001A]"
      :class="value ? 'translate-x-[18px] ' : 'translate-x-0'"
    />
  </label>
</template>
<script setup lang="ts">
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', value: boolean): void
}>()

const value = ref(false)

watch(
  () => props.modelValue,
  (newValue: boolean) => {
    if (newValue === value.value) return
    value.value = newValue
  },
  { immediate: true }
)
const handleChange = (e) => {
  const target = e?.target

  if (target === null) {
    return
  }
  value.value = target.checked
  emit('input', value.value)
}
</script>
