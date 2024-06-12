<template>
  <FormInput
    :id="id"
    v-model="search"
    :input-class="[
      'sm:!text-2xs !py-2.5',
      {
        '!pl-0': !noSearchIcon,
      },
      inputClass,
    ]"
    :placeholder="placeholder"
    v-bind="{ inputId }"
    class="focus-within:!border-orange"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  >
    <template v-if="!noSearchIcon" #prefix>
      <div
        class="h-max pl-2 pr-2 pointer-events-none flex-center"
        :class="searchIconWrapper"
      >
        <!--        <IconSearch-->
        <!--          class="icon-search-bold flex-center text-xl text-dark translate-y-px"-->
        <!--          :class="iconClass"-->
        <!--        />-->
      </div>
    </template>
    <template #suffix>
      <div
        v-if="!noClear"
        class="px-3 h-max flex-center cursor-pointer transition-300 opacity-0 scale-75 group invisible"
        :class="{ '!opacity-100 !scale-100 !visible': search?.length }"
        @click.stop="clearInput"
      >
        <slot name="suffix">
          <div class="w-5 h-5">
            <!--            <IconClose-->
            <!--              class="text-xl text-gray-100 group-hover:text-red transition-300 !mb-0"-->
            <!--              :class="[iconClass, iconCloseStyles]"-->
            <!--            />-->
          </div>
        </slot>
      </div>
    </template>
  </FormInput>
</template>

<script lang="ts" setup>
// import IconClose from '~/assets/icons/common/close.svg'
// import IconSearch from '~/assets/icons/common/search.svg'
import { debounce } from '~/utils/functions/common'

interface Props {
  noSearchIcon?: boolean
  placeholder?: string
  modelValue?: string
  inputClass?: string
  iconClass?: string
  inputId?: string
  searchIconWrapper?: string
  noClear?: boolean
  id?: string
  iconCloseStyles?: string
}
const props = defineProps<Props>()

interface Emits {
  (e: 'search', v: string): void
  (e: 'clear'): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'update:modelValue', v: string): void
}
const emit = defineEmits<Emits>()

const search = ref<string>('')

watch(
  () => search.value,
  (v) => {
    debounce(
      'search',
      () => {
        emit('update:modelValue', v)
      },
      700
    )
  }
)

function clearInput() {
  search.value = ''
  emit('clear')
}

watch(
  () => props.modelValue,
  (val) => {
    search.value = val
  },
  { immediate: true }
)
</script>
