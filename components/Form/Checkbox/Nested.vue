<template>
  <div>
    <div
      v-if="!notAll"
      class="flex-center-between border-b border-gray-300 pb-2.5"
      :class="itemClass"
    >
      <FormCheckbox
        :checked="isAllChecked"
        :partial="ids?.length && !isAllChecked"
        :label="parentText"
        @update:model-value="onParentInput"
      />
    </div>

    <label
      v-for="(i, index) in list"
      :key="index"
      class="flex items-center gap-3 py-2.5 border-b border-gray-300 last:border-0"
      :class="itemClass"
    >
      <FormCheckbox
        :checked="ids.includes(i.id)"
        :value="i.id"
        :label="i?.name"
        @update:model-value="onInput($event, i.id)"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string[]
  list: {
    name: string
    id: number
  }[]
  itemClass?: string
  parentText: string
  notAll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
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
