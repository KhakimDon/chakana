<template>
  <div>
    <NuxtLinkLocale
      to="/profile/orders"
      class="inline-flex items-center gap-1 md:gap-2 text-lg md:text-[22px] font-extrabold leading-7 text-dark group"
    >
      <SvgoCommonChevron
        class="text-xl md:text-[28px] leading-5 md:leading-[28px] text-dark group-hover:-translate-x-0.5 transition-300"
      />
      #{{ $route.params.id }}
    </NuxtLinkLocale>
    <ProfileOrderRate
      v-if="status === 'delivered' && !orderStatus?.rank && !ranked"
      :id="$route.params.id"
      @ranked="ranked = true"
    />
    <template v-else>
      <template v-if="status !== 'delivered' && status !== 'cancelled'">
        <BaseStepper class="my-6 md:my-8" :step="status" :steps />
        <h1
          class="text-center text-xl md:text-2xl font-extrabold leading-130 text-dark mb-1"
        >
          {{ $t(`order_statuses.${status}`) }}
        </h1>
        <p
          class="text-sm leading-140 text-dark font-normal text-center mb-4 md:mb-8 max-w-[343px] mx-auto"
        >
          {{ $t(`order_statuses.${status}_description`) }}
        </p>
      </template>
      <Transition name="fade" mode="out-in">
        <div :key="productsLoading" class="mt-4 md:mt-8 flex flex-col">
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
      <template v-if="status === 'delivered'">
        <div
          v-if="products?.returned_products?.length"
          class="flex-between mt-10"
        >
          <h3 class="text-base text-dark font-extrabold leading-130 mb-3">
            {{ $t('returned_products') }}
          </h3>
        </div>
        <Transition name="fade" mode="out-in">
          <div :key="productsLoading" class="flex flex-col">
            <template v-if="productsLoading">
              <div
                v-for="key in 5"
                :key
                class="shimmer w-full h-16 rounded-10 pl-0 border-b border-white-100 mb-2 last:mb-0"
              />
            </template>
            <template v-else>
              <SearchCardProduct
                v-for="(item, index) in products?.returned_products"
                :key="index"
                :product="item"
                show-count
                returned
                class="even:bg-gray-300/50"
              />
            </template>
          </div>
        </Transition>
        <h3 class="text-base text-dark font-extrabold leading-130 mb-3 mt-5">
          {{ $t('delivery_details') }}
        </h3>
        <PaymentCardInfo
          no-clickable
          icon="SvgoProfileTruck"
          icon-class="text-orange !text-2xl"
          :title="$t('courier_address')"
          :subtitle="data.delivery?.address"
        />
        <PaymentCardInfo
          no-clickable
          icon="SvgoProfileClockLocation"
          icon-class="text-purple-500 !text-2xl"
          :title="dayjs(data.delivery?.date).format('DD.MM.YYYY HH:mm')"
        />
        <PaymentCardInfo
          no-clickable
          icon="SvgoProfileUserCircle"
          icon-class="text-[#088377] !text-2xl"
          text-wrapper-class="border-none"
          :title="`${data.delivery?.customer?.full_name}, ${data.delivery?.customer?.phone}`"
        />
      </template>
      <ProfileOrderCourier
        v-if="
          data.delivery?.carrier?.id &&
          (status === 'on_the_way' || status === 'delivered')
        "
        :no-write="status === 'delivered'"
        class="mt-6"
        :courier="data.delivery.carrier"
      />
      <h3
        v-if="status === 'delivered'"
        class="text-base text-dark font-extrabold leading-130 mb-3 mt-6"
      >
        {{ $t('payment_method') }}
      </h3>
      <!--      Todo: fix it-->
      <PaymentCardInfo
        v-if="status === 'delivered'"
        class="mb-5"
        icon="SvgoProfileMoney"
        icon-class="text-green !text-2xl"
        no-clickable
        text-wrapper-class="border-none"
        :title="
          data.payment_type === 'cash'
            ? $t('cash')
            : data.payment_type === 'card_to_courier'
            ? $t('courier_card')
            : data.payment_type === 'card'
            ? $t('payment_via_card')
            : data.payment_type === 'provider'
            ? data.provider?.name
            : data.payment_type === 'balance'
            ? $t('use_balance')
            : $t('payment_method')
        "
      />
      <BaseButton
        v-if="status === 'delivered' || status === 'cancelled'"
        class="w-full sticky bottom-7"
        :text="$t('reorder')"
        :loading="reorderLoading"
        @click="reOrder"
      >
        <template #prefix>
          <SvgoCommonRefresh class="text-2xl leading-6" />
        </template>
      </BaseButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import {
  SvgoCommonChevron,
  SvgoCommonFlag,
  SvgoCommonMap,
  SvgoCommonTick,
  SvgoProfileSidebarCart,
} from '#components'
import type { IOrderDetail } from '~/types/profile.js'

const route = useRoute()
const router = useRouter()

const localePath = useLocalePath()

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

const { data, error } = await useAsyncData('orderSingle', () =>
  useApi().$get<IOrderDetail>(`/order/detail/${route.params.id}`)
)
if (error.value) showError({ statusCode: 404 })

const { data: orderStatus } = await useAsyncData('orderStatus', () =>
  useApi().$get(`/order/status/${route.params.id}`)
)
const status = computed(() => orderStatus.value?.status)

const products = ref()
const productsLoading = ref(true)

const ranked = ref(orderStatus.value?.rank)
useApi()
  .$get(`order/products/${route.params.id}`)
  .then((res) => {
    products.value = res
  })
  .finally(() => (productsLoading.value = false))

const reorderLoading = ref(false)
function reOrder() {
  reorderLoading.value = true
  const list = products.value?.delivered_products.map((el) => {
    return {
      product_id: el.id,
      count: el.quantity,
    }
  })
  useApi()
    .$post(`/cart/add/mobile`, {
      body: {
        products: list,
      },
    })
    .then(() => {
      router.push(localePath('/cart'))
    })
    .finally(() => (reorderLoading.value = false))
}
</script>
