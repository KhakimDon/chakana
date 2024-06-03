<template>
  <BaseDropdown
    :show="showDropdown"
    :head-class="[
      'flex items-center gap-1 text-gray-700 hover:opacity-80 transition-300 cursor-pointer py-2 transition-colors duration-300',
      {
        '!text-blue !opacity-100': showDropdown,
        'text-white': variant === 'transparent',
      },
    ]"
    body-class="!w-[70px] border border-gray-250 bg-white rounded-lg"
    @toggle="handleDropdownToggle"
  >
    <template #head>
      <div class="flex items-center gap-1">
        <IconGlobe class="text-xl text-gray" />
        <span
          class="text-sm transition-300 text-dark leading-130 font-semibold"
        >
          {{ currentLanguage?.name }}
        </span>
        <div :class="{ '!rotate-180': showDropdown }" class="transition-300">
          <IconChevron class="-rotate-90" />
        </div>
      </div>
    </template>
    <template #body>
      <div
        v-for="(lang, index) in languagesList"
        :key="index"
        class="w-full group"
      >
        <div
          class="flex gap-2 justify-between py-1.5 px-2 cursor-pointer transition-300 hover:bg-orange/20 rounded"
          @click="onChangeLocale(lang?.code)"
        >
          <span class="text-sm leading-130 font-semibold text-dark">
            {{ lang.name }}
          </span>

          <IconTick
            v-if="lang?.code === currentLanguage?.code"
            class="text-base text-green"
          />
        </div>
      </div>
    </template>
  </BaseDropdown>
</template>

<script lang="ts" setup>
import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconGlobe from '~/assets/icons/Common/globe.svg'
import IconTick from '~/assets/icons/Common/tick.svg'
import { useLanguageSwitcher } from '~/composables/useLanguageSwitcher'

interface Props {
  variant: 'default' | 'transparent'
}

defineProps<Props>()

const { changeLocale, currentLanguage, languagesList } = useLanguageSwitcher()

const showDropdown = ref(false)
const chevronClass = ref('')

function handleDropdownToggle(val: boolean) {
  showDropdown.value = val
  if (val) {
    chevronClass.value = 'animation-chevron'
  } else {
    chevronClass.value = 'animation-chevron-backward'
  }
}

const onChangeLocale = (code: string) => {
  showDropdown.value = false
  changeLocale(code)
}
</script>

<style scoped>
.animation-chevron {
  animation: rotate 0.3s ease-out forwards;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}

.animation-chevron-backward {
  animation: rotate 0.3s ease-in reverse forwards;
}
</style>
