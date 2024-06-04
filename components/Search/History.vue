<template>
  <div
    class="flex-y-center relative gap-2 pb-2 after:w-[calc(100%-20px)] last:after:hidden after:h-px after:absolute after:right-0 after:bottom-0 after:bg-gray-300"
  >
    <IconClose
      class="text-gray text-xl transition-300 hover:text-red cursor-pointer"
    />
    <p
      class="text-sm leading-130 font-medium text-dark hover:text-orange transition-300 cursor-pointer"
    >
      {{ title }}
    </p>
  </div>
</template>
<script setup lang="ts">
import IconClose from '~/assets/icons/Common/close.svg'

interface Props {
  title: string
}

defineProps<Props>()
</script>
