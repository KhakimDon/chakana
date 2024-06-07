<template>
  <div
    :class="badgeClass"
    class="px-1 py-0.5 flex-y-center rounded-[5px] w-max gap-0.5"
  >
    <component :is="badgeIcon" class="text-[10px] text-white" />
    <p class="text-[10px] font-semibold text-white uppercase leading-122">
      {{ badgeText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import IconFlame from '~/assets/icons/Common/flame.svg'
import IconFlash from '~/assets/icons/Common/flash.svg'

interface Props {
  type: 'fixed' | 'percentage' | 'unknown'
  percent?: number
}

const props = defineProps<Props>()

const { t } = useI18n()

const badgeClasses = {
  percent: 'bg-gradient-to-b from-orange-500 to-orange-600 text-white',
  percentage: 'bg-gradient-to-b from-orange-500 to-orange-600 text-white',
  unknown: 'bg-green text-gray-700',
}

const badgeTexts = {
  percent: `-${props.percent}%`,
  percentage: t('product_of_day'),
  unknown: t('profitable'),
}

const badgeIcons = {
  percent: IconFlame,
  percentage: IconFlame,
  unknown: IconFlash,
}

const badgeIcon = badgeIcons[props.type]
const badgeText = badgeTexts[props.type]
const badgeClass = badgeClasses[props.type]
</script>
