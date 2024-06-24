<template>
  <div ref="select" class="relative">
    <!--  SELECTED OPTION  -->
    <div
      class="transition-300 px-3 h-10 py-[9px] bg-gray-300 transition-all duration-300 border border-transparent cursor-pointer flex items-center justify-between rounded-lg"
      tabindex="1"
      :class="[
        selectedOptionStyles,
        error ? '!border-red' : '',
        { 'focus-within:border-gray-100': disabled },
        headStyles,
      ]"
      @click="toggleSelect(!showOptions)"
    >
      <slot name="selectedOption" :value="value">
        <p
          v-if="!value"
          tabindex="1"
          class="text-dark-100 select-none font-semibold text-sm leading-140"
          :class="[{ '!text-gray': disabled }, labelClass]"
        >
          {{ placeholder ?? $t('select') }}
        </p>
        <div v-else class="flex gap-1 items-center">
          <img :src="value.image" alt="" width="24" height="24">
          <p
              class="select-none text-sm text-dark-100 leading-140 font-semibold"
              tabindex="1"
              :class="[
            { '!text-gray': disabled },
            selectedStyles,
            { '!line-clamp-1': multiple },
          ]"
          >
            {{ value[labelKey] || value }}
          </p>
        </div>

        <slot name="chevron">
          <span
            class="icon-chevron-curved flex-center h-4 transition-300 text-base text-gray-700 inline-block shrink-0"
            :class="{ '!rotate-180': showOptions }"
          >
          </span>
        </slot>
        <slot name="icon"> </slot>
      </slot>
    </div>
    <!--  OPTIONS  -->
    <Transition name="fade">
      <ul
        v-if="showOptions && !disabled"
        :key="showOptions"
        :class="[fromTop ? '!bottom-[65px]' : '!top-full', optionClass]"
        class="absolute p-2 w-full bg-white border border-white-100 z-[100] translate-y-3 overflow-hidden max-h-[300px] overflow-y-scroll text-white rounded-md shadow-select"
      >
        <slot name="options">
          <template v-if="options?.length">
            <li
              v-for="(option, idx) in options"
              :key="idx"
              class="transition-300 cursor-pointer rounded hover:bg-gray-300"
              @click="onSelect(option)"
            >
              <slot name="option" :option="option" :index="idx">
                <p class="flex-y-center justify-between py-2 px-3">
                <div class="flex-y-center gap-1">
                  <img :src="option.image" alt="" width="24" height="24">
                  <span
                      class="text-dark text-[13px]"
                  >
                    {{ option[labelKey] }}
                  </span>
                </div>
                  <div
v-if="isRadio"
                      class="bg-white rounded-full w-5 h-5 border-2 border-gray-200 transition-300"
                      :class="isActive(option) ? 'border-orange border-[5px]' : ''"
                  ></div>
                </p>
              </slot>
            </li>
          </template>
          <template v-else>
            <div
              class="transition-300 cursor-pointer rounded"
            >
              <p
                class="flex-y-center justify-between py-2 px-3 text-dark text-[13px]"
              >
                {{ $t('no_results') }}
              </p>
            </div>
          </template>
        </slot>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref, watch } from 'vue'

type TOption = string | number | { [key: string]: string | number }

export interface Props {
  modelValue?: TOption
  options: TOption[]
  labelClass?: string
  labelKey: string
  valueKey: string
  placeholder?: string
  selectedOptionStyles?: TClassName
  selectedStyles?: TClassName
  headStyles?: TClassName
  dark?: boolean
  error?: boolean
  disabled?: boolean
  activeIcon?: boolean
  customeDropListClass?: string
  optionClass: string | string[]
  multiple?: boolean
  fromTop?: boolean
  isRadio?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  labelKey: 'name',
  valueKey: 'id',
  fromTop: false,
  isRadio: false,
})

const emit = defineEmits<{
  (e: 'on-toggle', value: boolean): void
  (e: 'update:modelValue', value: boolean): void
  (e: 'load'): void
  (e: 'on-select', value: TOption): void
}>()

const showOptions = ref(false)
function toggleSelect(newValue = showOptions.value) {
  showOptions.value = newValue
  emit('on-toggle', showOptions.value)
}

function findOption(option: TOption) {
  return props.options.find((o) => o === option || o[props.valueKey] == option)
}

const value = ref(findOption(props.modelValue))
function onSelect(option: TOption) {
  value.value = option
  toggleSelect(false)
  emit('update:modelValue', option[props.valueKey] || option)
  emit('on-select', option)
}

const select = ref()
onClickOutside(select, () => toggleSelect(false))

function isActive(option: TOption) {
  return (
    option === value.value ||
    option[props.valueKey as keyof typeof option] === value.value ||
    (typeof value.value === 'object' &&
      option[props.valueKey as keyof typeof option] ===
        value.value[props.valueKey])
  )
}

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = findOption(newValue)
    if (props.multiple) {
      value.value = ''
      const list = []
      for (const i in props.modelValue) {
        const index = props.options.findIndex(
          (o) => o[props.valueKey] === props.modelValue[i]
        )
        if (index !== -1) {
          list.push(props.options[index]?.title)
        }
      }
      value.value = list.join(' , ')
    }
  },
  { immediate: true, deep: true }
)
</script>


<style scoped>
/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #f2f2f2;
  height: 4px !important;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #dadada;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #dadada;
}
</style>
