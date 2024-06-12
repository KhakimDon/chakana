<template>
  <div
    class="absolute bottom-full left-1/2 -translate-x-1/2 transition-300 bg-orange dark:bg-white text-white rounded-lg"
    :class="[
      show && withTrigger
        ? '!-translate-y-1/3 visible opacity-100'
        : 'translate-y-0 invisible opacity-0',
      {
        ' group-hover:visible group-hover:opacity-100 group-hover:-translate-y-1/3':
          !withTrigger,
      },
    ]"
  >
    <div
      class="tooltip bg-orange text-white dark:text-dark rounded h-full py-1 px-2 text-[12.5px] leading-130 relative after:absolute after:top-full after:left-1/2 after:-ml-1 after:border-[5px] after:border-transparent before:!border-t-orange dark:before:!border-t-white before:absolute before:top-full before:left-1/2 before:ml-[-5.5px] before:border-[6.5px] before:border-transparent"
      :class="tooltipStyles"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  withTrigger?: boolean
  show?: boolean
  tooltipStyles?: string
}
defineProps<Props>()
</script>
