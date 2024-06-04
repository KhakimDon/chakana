<template>
  <div ref="target" class="relative" data-dropdown="0" tabindex="0">
    <div :class="headClass" @click.stop="toggleShow">
      <slot name="head"></slot>
    </div>
    <Transition :name="isAbove ? 'dropdown-bottom' : 'dropdown'" mode="out-in">
      <div
        v-if="showBody"
        class="absolute right-0 w-max min-w-full translate-y-full bg-white rounded-md overflow-hidden z-[11] shadow-md border border-white-100"
        :class="[bodyClass, isAbove ? 'bottom-[206px]' : '-bottom-1']"
        data-dropdown-body
      >
        <slot name="body" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'

import type { TClassName } from '~/types'

interface Props {
  headClass?: TClassName
  bodyClass?: TClassName
  show?: boolean | undefined
  withTrigger?: boolean
  isAbove?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  show: undefined,
  headClass: '',
  bodyClass: '',
})

interface Emits {
  (e: 'toggle', v: boolean): void
}
const emit = defineEmits<Emits>()

const showBody = ref(props.show ?? false)

function toggleShow() {
  if (!props.withTrigger) {
    if (props.show === undefined) {
      showBody.value = !showBody.value
    } else {
      emit('toggle', !props.show)
    }
  }
}

watch(
  () => props.show,
  (v) => {
    showBody.value = v
  }
)
const target = ref<HTMLElement | null>(null)
onClickOutside(target, () => {
  if (props.show === undefined) {
    showBody.value = false
  } else {
    emit('toggle', false)
  }
})
</script>

<style scoped>
@keyframes dropdown {
  0% {
    opacity: 0;
    bottom: -12px;
  }
  100% {
    opacity: 1;
    bottom: -4px;
  }
}

.dropdown-enter-active {
  animation: dropdown 0.3s ease-in-out;
}
.dropdown-leave-active {
  animation: dropdown 0.3s ease-in-out reverse;
}

@keyframes dropdown-bottom {
  0% {
    opacity: 0;
    bottom: 210px;
  }
  100% {
    opacity: 1;
    bottom: 206px;
  }
}

.dropdown-bottom-enter-active {
  animation: dropdown-bottom 0.3s ease-in-out;
}
.dropdown-bottom-leave-active {
  animation: dropdown-bottom 0.3s ease-in-out reverse;
}
</style>
