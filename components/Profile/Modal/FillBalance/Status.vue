<script setup lang="ts">
import dayjs from 'dayjs'

import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  status: 'success' | 'error' | 'pending'
  info: {
    payment: boolean
    amount: number
    total_amount: number
    balance: number
    transfer_date: string
    payment_type: 'card' | 'provider'
    provider: any
    commission: number
  }
}
const props = defineProps<Props>()

defineEmits<{
  (e: 'back'): void
  (e: 'again'): void
}>()

const { t } = useI18n()

const infoList = computed(() => [
  {
    title: t('payment_way'),
    value: props.status === 'success' ? 'Paylov' : '-',
  },
  {
    title: t('commission'),
    value: props.status === 'success' ? `${props.info?.commission}%` : '-',
  },
  {
    title: t('transfer_date'),
    value:
      props.status === 'success'
        ? dayjs(props.info?.transfer_date).format('DD.MM.YYYY, HH:mm:ss')
        : '-',
  },
  {
    title: t('amount'),
    value:
      props.status === 'success' ? formatMoneyDecimal(props.info?.amount) : '-',
    subValue: 'uzs',
  },
])

const title = computed(() => {
  if (props.status === 'success') {
    return `${formatMoneyDecimal(props.info?.total_amount)} UZS`
  } else if (props.status === 'error') {
    return t('canceled')
  } else {
    return t('payment_pending')
  }
})

const text = computed(() => {
  if (props.status === 'success') {
    return t('payment_successful')
  } else if (props.status === 'error') {
    return t('payment_canceled_or_failed')
  } else {
    return t('wait_payment_systems')
  }
})

const statusIcon = computed(() => {
  if (props.status === 'success') {
    return {
      wrapperClass: 'bg-[linear-gradient(180deg,_#13B541_0%,_#00992B_100%)]',
      icon: 'SvgoCommonTick',
      iconClass: 'text-[60px]',
    }
  } else if (props.status === 'error') {
    return {
      wrapperClass: 'bg-orange',
      icon: 'SvgoCommonInfo',
      iconClass: 'text-[42px]',
    }
  } else {
    return {
      wrapperClass: 'bg-[linear-gradient(180deg,_#FACF61_0%,_#CC9200_100%)]',
      icon: 'SvgoCommonClock',
      iconClass: 'text-[64px]',
    }
  }
})
</script>

<template>
  <div>
    <div
      class="w-[92px] h-[92px] mx-auto flex-center rounded-full relative mb-6"
      :class="statusIcon.wrapperClass"
    >
      <span
        class="rounded-full border-[3px] border-white/20 absolute inset-0 z-10 pointer-events-none"
      ></span>
      <component
        :is="statusIcon.icon"
        class="text-white"
        :class="statusIcon.iconClass"
      />
    </div>
    <h3 class="text-xl leading-130 font-extrabold text-dark text-center mb-2">
      {{ title }}
    </h3>
    <p class="text-sm font-normal leading-140 text-gray-100 text-center mb-6">
      {{ text }}
    </p>
    <div class="p-4 rounded-xl bg-gray-300">
      <div class="flex flex-col gap-3 pb-4 border-b border-gray-200 mb-4">
        <div
          v-for="(item, index) in infoList"
          :key="index"
          class="flex justify-between"
        >
          <p class="text-sm leading-130 font-medium text-gray-100">
            {{ item.title }}
          </p>
          <div class="flex items-end gap-1">
            <p class="text-sm leading-130 font-bold text-dark">
              {{ item.value }}
            </p>
            <span v-if="item.subValue" class="text-xs uppercase font-bold">{{
              item.subValue
            }}</span>
          </div>
        </div>
      </div>
      <div class="flex-center-between">
        <p class="text-base leading-130 font-extrabold text-dark">
          {{ $t('total_sum') }}
        </p>
        <p
          class="flex items-end text-xl font-extrabold leading-130 gap-1 text-green"
        >
          {{ status === 'success' ? info?.total_amount : '-' }}
          <span class="text-sm leading-140">UZS</span>
        </p>
      </div>
    </div>
    <div class="flex gap-4 mt-6">
      <BaseButton
        :variant="status === 'success' ? 'primary' : 'secondary'"
        class="w-full"
        :text="$t('go_back')"
        @click="$emit('back')"
      />
      <BaseButton
        v-if="status !== 'success'"
        class="w-full"
        :text="$t('try_again')"
        @click="$emit('again')"
      />
    </div>
  </div>
</template>
