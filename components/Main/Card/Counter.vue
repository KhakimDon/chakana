<template>
  <div
    class="i-counter h-9 flex-center-between w-full rounded-lg border border-white-100 gap-2 p-2"
  >
    <button
      :disabled="disableDecrease"
      class="text-base text-dark hover:text-orange transition-300"
      @click="decrease"
    >
      <IconTrash v-if="count === 1" class="!mb-0" />
      <IconMinus v-else class="!mb-0" />
    </button>
    <div :class="{ readonly }" class="h-100">
      <input
        v-model="count"
        v-maska="inputMask"
        type="text"
        :readonly="readonly"
        :min="min"
        :max="max"
        class="w-full h-full text-center text-xs leading-5 text-dark font-semibold"
        :class="{ error }"
        @input="onChangeCount"
      />
    </div>
    <button
      :disabled="disableIncrease"
      class="text-base text-dark hover:text-orange transition-300"
      @click="increase"
    >
      <IconPlus class="!mb-0" />
    </button>
  </div>
</template>

<script setup lang="ts">
import IconMinus from '~/assets/icons/Common/minus.svg'
import IconPlus from '~/assets/icons/Common/plus.svg'
import IconTrash from '~/assets/icons/Common/trash.svg'

// ******* PROPS *******

interface Props {
  defaultCount?: number
  disableIncrease?: boolean
  disableDecrease?: boolean
  error?: boolean
  readonly?: boolean
  residentValidation?: boolean
  inputMask?: string
  max?: number
  min?: number
}
const props = withDefaults(defineProps<Props>(), {
  defaultCount: 0,
  min: 0,
  max: 999,
  inputMask: '###',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'decrease'): void
}>()

const count = ref(0)

watch(
  () => props.defaultCount,
  (newValue) => {
    if (newValue) {
      count.value = newValue
    }
  },
  { immediate: true }
)

watch(
  () => count.value,
  () => {
    if (count.value < props.min) {
      count.value = props.min
    }
    if (count.value > props.max) {
      count.value = props.max
    }
    emit('update:modelValue', count.value)
  },
  { immediate: true, deep: true }
)

const decrease = () => {
  if (
    count.value > 0 &&
    !props.disableDecrease &&
    ((props.residentValidation && count.value - 1 >= props.defaultCount) ||
      !props.residentValidation)
  ) {
    emit('decrease')
    count.value--
  }
}
const increase = () => {
  if (!props.disableIncrease) {
    count.value++
  }
}
const onChangeCount = (event: InputEvent) => {
  const target = event.target as HTMLInputElement

  if (target?.value.includes('-') || event.data?.includes('-')) {
    return event.preventDefault()
  }
}

watch(
  () => count.value,
  () => {
    if (count.value < props.min) {
      count.value = props.min
    }
    if (count.value > props.max) {
      count.value = props.max
    }
  },

  { deep: true, immediate: true }
)
</script>
<style scoped>
.error {
  @apply border border-solid border-[#fd5757];
}
.readonly {
  @apply relative before:w-full before:h-full before:bg-transparent before:z-10 before:absolute before:top-0 before:left-0;
}
</style>
