<template>
  <div>
    <div class="flex-center-between">
      <NuxtLinkLocale
        to="/profile/orders"
        class="inline-flex items-center gap-1 md:gap-2 text-lg md:text-[22px] font-extrabold leading-7 text-dark group"
      >
        <SvgoCommonChevron
          class="text-xl md:text-[28px] leading-5 md:leading-[28px] text-dark group-hover:-translate-x-0.5 transition-300"
        />
        {{ data.name }}
      </NuxtLinkLocale>
      <button
        class="flex-y-center gap-1 text-red text-sm font-semibold leading-5 transition-300 group hover:text-orange"
      >
        <SvgoCommonPlus
          class="text-xl leading-5 text-red transition-300 group-hover:text-orange"
        />
        {{ $t('add_product') }}
      </button>
    </div>
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
            v-for="(item, index) in products"
            :key="index"
            :product="item"
            class="even:bg-gray-300/50"
          />
        </template>
      </div>
    </Transition>
    <h3 class="text-base text-dark font-extrabold leading-130 mb-3 mt-5">
      {{ $t('delivery_details') }}
    </h3>

    <PaymentCardInfo
      icon="SvgoCommonEdit"
      icon-class="!text-[#9747FF] !text-2xl"
      :title="$t('auto_order_title')"
      :subtitle="data.name"
    />
    <PaymentCardInfo
      icon="SvgoProfileClockLocation"
      icon-class="!text-[#9747FF] !text-2xl"
      :title="data.delivery_date"
    />
    <PaymentCardInfo
      icon="SvgoProfileUserCircle"
      icon-class="!text-[#088377] !text-2xl"
      :title="data.recipient"
    />
    <PaymentCardInfo
      icon="SvgoProfileClockLocation"
      icon-class="!text-orange !text-2xl"
      :title="$t('courier_address')"
      :subtitle="data.shipping_address"
      text-wrapper-class="border-none"
    />
    <h3 class="text-base text-dark font-extrabold leading-130 mb-3 mt-6">
      {{ $t('payment_method') }}
    </h3>
    <!--      Todo: fix it-->
    <PaymentCardInfo
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
      class="w-full sticky bottom-7 !py-2.5"
      variant="secondary"
      :text="$t('delete_order')"
      :loading="deleteLoading"
      @click="deleteAutoOrder"
    >
      <template #prefix>
        <SvgoCommonTrash class="text-2xl leading-6" />
      </template>
    </BaseButton>
    <AutoOrderModalOrderName :model-value="true" />
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
import { useOrderStore } from '~/store/profile/orders.js'
import type { IOrderDetail } from '~/types/profile.js'

const route = useRoute()

const { showToast } = useCustomToast()
const { handleError } = useErrorHandling()
const { t } = useI18n()

const { data, error } = await useAsyncData('orderSingle', () =>
  useApi().$get<IOrderDetail>(`/auto-order/${route.params.id}`)
)
if (error.value) showError({ statusCode: 404 })

const products = ref()
const productsLoading = ref(true)

useApi()
  .$get(`auto-order/products/${route.params.id}`)
  .then((res) => {
    products.value = res
  })
  .finally(() => (productsLoading.value = false))

const orderStore = useOrderStore()
const deleteLoading = ref(false)
function deleteAutoOrder() {
  deleteLoading.value = true
  orderStore
    .deleteAutoOrder(data.value.id)
    .then(() => {
      showToast(t('auto_order_deleted_successfully'), 'success')
    })
    .catch((err) => {
      handleError(err)
    })
    .finally(() => {
      deleteLoading.value = false
    })
}
</script>
