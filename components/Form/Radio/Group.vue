<template>
  <div v-if="items?.length" :class="wrapperClass">
    <FormRadio
      v-for="(item, index) in items"
      :key="index"
      v-bind="{ disabled }"
      v-model="activeRadio"
      :label="item[labelKey]"
      :value="item[valueKey]"
      :name="radioName"
      :class="itemClass"
      @click="activeRadio = !disabled ? item[valueKey] : modelValue"
    >
      <template #label>
        <slot name="label" :data="item"></slot>
      </template>
    </FormRadio>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string | number | object
  items: Array<object>
  labelKey?: string
  valueKey?: string
  wrapperClass?: string
  disabled?: boolean
  itemClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  wrapperClass: 'flex flex-col',
  labelKey: 'name',
  valueKey: 'id',
  disabled: false,
})

const activeRadio = ref(props.modelValue)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | object): void
}>()

const radioName = `k-radio-${Math.floor(Math.random() * 1000)}`

const value = ref<string | number | object>([])

watch(
  () => activeRadio.value,
  (newValue) => {
    if (newValue !== value.value) {
      value.value = newValue
    }
    if (!props.disabled) {
      emit('update:modelValue', value.value)
    }
  }
)
</script>
