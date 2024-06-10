<template>
  <div class="flex-y-center gap-3">
    <div class="shrink-0 flex-center">
      <component
        :is="icon"
        class="text-base text-gray-100"
        :class="iconClass"
      />
    </div>
    <div
      class="flex-y-center border-b group justify-between border-white-100 py-2 w-full h-[52px]"
      :class="{ 'cursor-pointer': !noClickable }"
      @click="noClickable ? null : emit('openDetails')"
    >
      <div class="space-y-1">
        <slot />
        <p
          v-if="title"
          :class="titleClass"
          class="text-sm font-semibold group-hover:text-orange transition-300 text-dark leading-tight"
        >
          {{ title }}
        </p>
        <p
          v-if="subtitle"
          :class="subtitleClass"
          class="text-xs font-normal text-gray-100 leading-none"
        >
          {{ subtitle }}
        </p>
      </div>
      <SvgoCommonChevron
        v-if="!noClickable"
        class="text-2xl group-hover:text-orange transition-300 text-gray-100 rotate-180"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  icon: string
  titleClass?: string
  subtitleClass?: string
  iconClass?: string
  noClickable?: boolean
}

defineProps<Props>()

const emit = defineEmits(['openDetails'])
</script>

<style scoped></style>
