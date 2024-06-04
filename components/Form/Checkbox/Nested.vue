<template>
  <div>
    <div class="flex-center-between border-b border-gray-300 pb-2.5">
      <FormCheckbox
        :checked="isAllChecked"
        :partial="ids?.length && !isAllChecked"
        :label="parentText"
        @update:model-value="onParentInput"
      />
      <i
        v-if="!notCollapse"
        class="icon-chevron text-gray transition-300 cursor-pointer"
        :class="{ 'rotate-180': isOpen }"
        @click="isOpen = !isOpen"
      />
    </div>

    <label
      v-for="(i, index) in list"
      :key="index"
      class="flex items-center gap-3 py-2.5 border-b border-gray-300 last:border-[0px]"
    >
      <FormCheckbox
        :checked="ids.includes(i.id)"
        :value="i.id"
        :label="i?.name"
        :info-icon="i?.infoIcon"
        :info-text="i?.text"
        :info-link="i?.path"
        @update:model-value="onInput($event, i.id)"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue'

interface Props {
  modelValue: string[]
  list: {
    title: string
    id: number
    infoIcon?: boolean
    text?: string
    path?: string
  }[]
  parentText: string
  nestedClass?: string
  notCollapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  nestedClass: undefined,
})

interface Emits {
  (event: 'change', value: string[]): void
  (event: 'update:modelValue', value: string[]): void
}
const emit = defineEmits<Emits>()

const ids = ref<string[]>([...(props?.modelValue ?? [])])

watch(
  () => props.modelValue,
  (value) => {
    ids.value = value
  },
  {
    deep: true,
    immediate: true,
  }
)

const parent = ref(false)

const isAllChecked = computed(() => {
  return ids.value?.length === props?.list?.length
})

const isOpen = ref(true)

function onParentInput(newValue: boolean) {
  if (newValue) {
    ids.value = props.list.map((item) => item.id)
  } else {
    ids.value = []
  }
}

function onInput(newValue: boolean, itemValue: number) {
  if (newValue) {
    ids.value.push(itemValue)
  } else {
    ids.value = ids.value.filter((item) => item !== itemValue)
  }

  parent.value = ids.value.length === props.list.length
}

watch(
  () => ids.value,
  () => {
    emit('update:modelValue', ids.value)
  },
  {
    deep: true,
  }
)

watch(
  () => isAllChecked.value,
  () => {
    parent.value = isAllChecked.value
  }
)
</script>
