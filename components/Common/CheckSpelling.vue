<template>
  <div class="flex flex-col gap-3 mt-5">
    <div
      v-for="(word, index) in words"
      :key="index"
      class="flex-y-center gap-3"
    >
      <div class="w-1.5 h-1.5 rounded-full bg-gray-200" />
      <FormInput
        v-model="words[index]"
        class="!p-0 !border-none !bg-transparent"
        :input-id="'word-' + index"
        :input-class="[{ '!underline': !isCorrect(word) }, '!p-0 sm:!text-lg']"
        @keydown.enter="addWord(index)"
        @keydown.backspace="removeWord($event, index)"
        @keydown.down="focusDown(index)"
        @keydown.up="focusUp(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Typo from 'typo-js'
import { onMounted, ref } from 'vue'

// Define reactive data
const words = ref([''])
const dictionary = ref<Typo | null>(null)

// Methods
function isCorrect(word: string): boolean {
  if (!dictionary.value) {
    return true
  }
  return dictionary.value.check(word)
}

onMounted(() => {
  dictionary.value = new Typo('ru_RU', false, false, {
    dictionaryPath: '/dictionaries',
  })
})

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
