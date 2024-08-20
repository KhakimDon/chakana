<template>
  <div>
    <div class="flex flex-row justify-between items-center w-full">
      <NuxtLinkLocale
        to="/profile/orders"
        class="inline-flex items-center gap-1 md:gap-2 text-lg md:text-[22px] font-extrabold leading-7 text-dark group"
      >
        <SvgoCommonChevron
          class="text-xl md:text-[28px] leading-5 md:leading-[28px] text-dark group-hover:-translate-x-0.5 transition-300"
        />
        #{{ $route.params.id }}
      </NuxtLinkLocale>

      <button
        class="text-gray-100 flex-nowrap p-1 hover:bg-gray-100/10 rounded px-1.5 text-nowrap flex flex-row items-center font-semibold text-sm space-x-[4px]"
        @click="showElectronCheck = true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.49935 5.83333H12.4993M7.49935 9.16667H12.4993M10.8327 12.5H12.4993M4.16602 17.5V4.16667C4.16602 3.72464 4.34161 3.30072 4.65417 2.98816C4.96673 2.67559 5.39065 2.5 5.83268 2.5H14.166C14.608 2.5 15.032 2.67559 15.3445 2.98816C15.6571 3.30072 15.8327 3.72464 15.8327 4.16667V17.5L13.3327 15.8333L11.666 17.5L9.99935 15.8333L8.33268 17.5L6.66602 15.8333L4.16602 17.5Z"
            stroke="#8F8F8F"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ $t('online_receipt_title') }}</span>
      </button>
    </div>

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
        no-write
        class="mt-6"
        :courier="data.delivery.carrier"
      />
      <h3
        v-if="status === 'delivered'"
        class="text-base text-dark font-extrabold leading-130 mb-3 mt-6"
      >
        {{ $t('payment_method') }}
      </h3>
      <PaymentCardInfo
        v-if="status === 'delivered'"
        class="mb-5"
        :icon="paymentIcon"
        :icon-class="`${paymentIconClass} !text-2xl`"
        no-clickable
        text-wrapper-class="border-none"
        :title="paymentTitle"
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

    <ElectronCheck
      v-model="showElectronCheck"
      :title="$t('online_receipt_title')"
    />
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
import DeleteConfirm from '~/components/Common/Modal/DeleteConfirm.vue'
import ElectronCheck from '~/components/Common/Modal/ElectronCheck.vue'
import { CONFIG } from '~/config/index.js'
import type { IOrderDetail } from '~/types/profile.js'

const route = useRoute()
const router = useRouter()
const showElectronCheck = ref(false)

const { t } = useI18n()
const { handleError } = useErrorHandling()

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
function getProducts() {
  useApi()
    .$get(`order/products/${route.params.id}`)
    .then((res) => {
      products.value = res
    })
    .finally(() => (productsLoading.value = false))
}
getProducts()

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

//  data.value?.payment_type === 'card_to_courier'
//     ? 'SvgoProfileUser'
//     :

const paymentIcon = computed(() => {
  return data.value?.payment_type === 'card'
    ? 'SvgoProfileCard'
    : data.value?.payment_type === 'provider'
    ? 'SvgoProfileCoins'
    : 'SvgoProfileMoney'
})

const paymentIconClass = computed(() => {
  return data.value?.payment_type === 'cash'
    ? '!text-green'
    : data.value?.payment_type === 'card'
    ? '!text-blue-100'
    : '!text-orange'
})

// data.value?.payment_type === 'card_to_courier'
//     ? t('courier_card')
//     :
const paymentTitle = computed(() => {
  return data.value?.payment_type === 'cash'
    ? t('cash')
    : data.value?.payment_type === 'card'
    ? t('credit_card')
    : data.value?.payment_type === 'provider'
    ? data.value?.provider?.id === 17
      ? 'Click'
      : 'Payme'
    : t('payment_method')
})

const connection = ref()
const connectStatusSocket = () => {
  try {
    connection.value = new WebSocket(`${CONFIG.WS_URL}/websocket`)

    connection.value.onopen = () => {
      const msg = {
        event_name: 'subscribe',
        data: {
          channels: [`order_status_${route.params.id}`],
          last: 0,
        },
      }
      connection.value.send(JSON.stringify(msg))
    }

    connection.value.onmessage = (event: any) => {
      const newData = JSON.parse(JSON.parse(event.data)[0].message.payload)
      orderStatus.value.status = newData.new_status
      useApi()
        .$get(`/order/detail/${route.params.id}`)
        .then((res) => {
          data.value = res
        })
      productsLoading.value = true
      getProducts()
    }
  } catch (error) {
    handleError(error)
  }
}

onBeforeUnmount(() => {
  if (connection.value && connection.value.readyState === WebSocket.OPEN) {
    connection.value.close()
  }
})

onMounted(() => {
  connectStatusSocket()
})
</script>
