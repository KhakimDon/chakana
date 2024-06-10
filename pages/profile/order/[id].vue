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

const products = ref()
const productsLoading = ref(true)

useApi()
  .$get(`order/products/${route.params.id}`)
  .then((res) => {
    products.value = res
  })
  .finally(() => (productsLoading.value = false))
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
    <template v-if="false">
      <template v-if="status !== 'delivered' && status !== 'cancelled'">
        <BaseStepper class="my-8" :step="status" :steps />
        <h1
          class="text-center text-2xl font-extrabold leading-130 text-dark mb-1"
        >
          {{ $t(`order_statuses.${status}`) }}
        </h1>
        <p
          class="text-sm leading-140 text-dark font-normal text-center mb-8 max-w-[343px] mx-auto"
        >
          {{ $t(`order_statuses.${status}_description`) }}
        </p>
      </template>
      <Transition name="fade" mode="out-in">
        <div :key="productsLoading" class="mt-8 mb-5 flex flex-col">
          <template v-if="productsLoading">
            <div
              v-for="key in 10"
              :key
              class="shimmer w-full h-16 rounded-10 pl-0 border-b border-white-100 mb-2 last:mb-0"
            />
          </template>
          <template v-else>
            <SearchCardProduct
              v-for="(item, index) in products?.delivered_products"
              :key="index"
              :product="item"
              show-count
              class="even:bg-gray-300/50"
            />
          </template>
        </div>
      </Transition>
      <ProfileOrderCourier
        v-if="data.delivery?.carrier?.id && status === 'on_the_way'"
        :courier="data.delivery.carrier"
      />
      <BaseButton
        v-if="status === 'delivered' || status === 'cancelled'"
        class="w-full sticky bottom-7"
        :text="$t('reorder')"
      >
        <template #prefix>
          <SvgoCommonRefresh class="text-2xl leading-6" />
        </template>
      </BaseButton>
    </template>
    <ProfileOrderRate v-else />
  </div>
</template>
