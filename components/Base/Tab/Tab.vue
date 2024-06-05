<template>
  <div
    class="relative p-1 bg-white-100 rounded-lg flex items-center overflow-hidden gap-1.5 w-full"
  >
    <div
      :class="activeClass"
      class="absolute py-1 rounded-md bg-white -translate-y-1/2 top-1/2 transition-all duration-300"
      :style="{
        width: `${active.width}px`,
        left: `${active.left}px`,
        height: '32px',
      }"
    ></div>
    <button
      v-for="(tab, idx) in list"
      :id="`item_${tab.value}`"
      :key="idx"
      class="p-1.5 z-10 transition-300 text-sm font-medium leading-5 z-5 whitespace-nowrap text-dark-100 md:px-9"
      :class="[
        itemClass,
        modelValue === tab.value
          ? `${activeItemsClass ?? ''} !font-semibold`
          : '',
      ]"
      :style="{ width: `${100 / list.length}%` }"
      @click="pick(tab.value, $event)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script lang="ts" setup>
interface Tab {
  label: string
  value: string | number
}
interface Props {
  modelValue?: string | number
  list: Tab[]
  itemClass?: string
  activeClass?: string
  activeItemsClass?: string
}
const props = defineProps<Props>()

interface Emits {
  (e: 'update:modelValue', value: string | number): void
}
const $emit = defineEmits<Emits>()

// const active = ref({ left: 0, width: 0 });
const active = ref({ left: 0, width: 0 })
const pick = (tab: string | number, e?: { target: HTMLButtonElement }) => {
  const target = e.target as HTMLButtonElement
  active.value = {
    left: target?.offsetLeft,
    width: target?.offsetWidth,
  }
  $emit('update:modelValue', tab)
}

watch(
  () => props.modelValue,
  () => {
    setTimeout(() => {
      const item = document.getElementById(
        `item_${props.modelValue}`
      ) as HTMLButtonElement
      pick(props?.modelValue, { target: item })
    }, 300)
  }
)

onMounted(() => {
  setTimeout(() => {
    const item = document.getElementById(
      `item_${props.modelValue}`
    ) as HTMLButtonElement
    pick(props?.modelValue, { target: item })
  }, 300)
})
</script>
