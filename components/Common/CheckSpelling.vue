<template>
  <div class="flex flex-col gap-1 mt-5">
    <div
      v-for="(word, index) in words"
      :key="index"
      class="flex-y-center gap-1"
    >
      <div class="w-1.5 h-1.5 rounded-full bg-gray-200" />
      <FormInput
        v-model="words[index]"
        class="!p-0 !border-none !bg-transparent"
        input-class="!p-1"
        :input-id="'word-' + index"
        @keydown.enter="addWord(index)"
        @keydown.backspace="removeWord($event, index)"
        @keydown.down="focusDown(index)"
        @keydown.up="focusUp(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: string[]
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const words = ref([''])

watch(
  () => words.value,
  (value) => {
    emit('update:modelValue', value)
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (value) => {
    words.value = value
  },
  { deep: true, immediate: true }
)

function addWord(index: number) {
  words.value.splice(index + 1, 0, '')
  setTimeout(() => {
    const nextInput = document.getElementById(
      `word-${index + 1}`
    ) as HTMLInputElement
    nextInput.focus()
  }, 100)
}

function removeWord(event: any, index: number) {
  if (index === 0) {
    return
  }
  if (words.value[index] === '') {
    event.preventDefault()
    words.value.splice(index, 1)
    const prevInput = document.getElementById(
      `word-${index - 1}`
    ) as HTMLInputElement
    prevInput.focus()
  }
}

function focusDown(index: number) {
  const nextInput = document.getElementById(
    `word-${index + 1}`
  ) as HTMLInputElement
  nextInput.focus()
}

function focusUp(index: number) {
  if (index === 0) {
    return
  }
  const prevInput = document.getElementById(
    `word-${index - 1}`
  ) as HTMLInputElement
  prevInput.focus()
}
</script>
