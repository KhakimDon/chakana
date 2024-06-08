<script setup lang="ts">
import {
  SvgoCommonChevron,
  SvgoCommonFlag,
  SvgoCommonMap,
  SvgoCommonTick,
  SvgoProfileSidebarCart,
} from '#components'
import type { IOrderDetail } from '~/types/profile.js'

const route = useRoute()

const steps = [
  {
    id: 'accepted',
    icon: SvgoCommonTick,
  },
  {
    id: 'collected',
    icon: SvgoProfileSidebarCart,
  },
  {
    id: 'on_the_way',
    icon: SvgoCommonMap,
  },
  {
    id: 'delivered',
    icon: SvgoCommonFlag,
  },
]
const step = ref(1)

const { data } = await useAsyncData('orderSingle', () =>
  useApi().$get<IOrderDetail>(`/order/detail/${route.params.id}`)
)

const { data: orderStatus } = await useAsyncData('orderStatus', () =>
  useApi().$get(`/order/status/${route.params.id}`)
)
const status = computed(() => orderStatus.value?.status)
</script>

<template>
  <div>
    <NuxtLinkLocale
      :to="`/profile/orders`"
      class="inline-flex items-center gap-2 text-[22px] font-extrabold leading-7 text-dark group"
    >
      <SvgoCommonChevron
        class="text-[28px] leading-[28px] text-dark group-hover:-translate-x-0.5 transition-300"
      />
      #{{ $route.params.id }}
    </NuxtLinkLocale>
    <BaseStepper class="my-8" :step="status" :steps />
    <h1 class="text-center text-2xl font-extrabold leading-130 text-dark mb-1">
      {{ $t(`order_statuses.${status}`) }}
    </h1>
    <p
      class="text-sm leading-140 text-dark font-normal text-center mb-8 max-w-[343px] mx-auto"
    >
      {{ $t(`order_statuses.${status}_description`) }}
    </p>
    <div class="mt-8 flex flex-col">
      <!--      <SearchCardProduct />-->
    </div>
  </div>
</template>

<style scoped></style>
