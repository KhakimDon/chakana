<template>
  <div class="flex flex-col gap-2">
    <p class="text-sm leading-130 font-medium text-dark" :class="labelClass">
      {{ label }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  labelClass?: string
  error?: boolean
  errorLabel?: string
}

withDefaults(defineProps<Props>(), {
  label: 'Label',
  labelClass: '',
  errorLabel: '',
})
</script>
