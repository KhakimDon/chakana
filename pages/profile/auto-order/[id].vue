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

    <PaymentSectionOrderName :default-info="data" @save="saveName" />

    <PaymentSectionClockLocation
      :default-info="{
        weekdays: data.delivery_date_data.weekdays[0],
        delivery_time: data.delivery_date_data.delivery_time,
      }"
      is-auto
      @save="saveOrderClock"
    />
    <PaymentSectionUserData
      :full_name="data.recipient_data.full_name"
      :phone="data.recipient_data.phone"
      @save="saveUser"
    />
    <PaymentSectionAddress
      :default-address="{
        address: data.shipping_address,
        id: data.shipping_address_data.address_id,
      }"
      @save="saveAddress"
    />
    <h3 class="text-base text-dark font-extrabold leading-130 mb-3 mt-6">
      {{ $t('payment_method') }}
    </h3>
    <PaymentSectionPaymentMethod
      :default-data="{
        card_to_courier: data.payment_type === 'card_to_courier',
        cash: data.payment_type === 'cash',
        card_id: data.payment_type === 'card' ? data.card_data?.id : 0,
        balance: data.payment_type === 'balance',
      }"
      @save="savePayment"
    />
    <BaseButton
      class="w-full !py-2.5 my-5"
      variant="secondary"
      :text="$t('delete_order')"
      :loading="deleteLoading"
      @click="deleteAutoOrder"
    >
      <template #prefix>
        <SvgoCommonTrash class="text-2xl leading-6" />
      </template>
    </BaseButton>
    <BaseButton
      class="w-full sticky bottom-7 !py-2.5"
      :text="$t('save_auto_order')"
      :loading="saveLoading"
      @click="saveAutoOrder"
    />
  </div>
</template>

<script setup lang="ts">
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
    .deleteAutoOrder(route.params.id)
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

const saveLoading = ref(false)
function saveAutoOrder() {
  saveLoading.value = true
  useApi()
    .$put(`/auto-order/update/${route.params.id}`, {
      body: {
        name: data.value.name,
        weekdays: data.value.delivery_date_data.weekdays,
        delivery_time: data.value.delivery_date_data.delivery_time,
        payment_type: {
          card_to_courier:
            typeof data.value.payment_type_data?.card_to_courier === 'boolean'
              ? data.value.payment_type_data?.card_to_courier
              : data.value.payment_type === 'card_to_courier',
          cash:
            typeof data.value.payment_type_data?.cash === 'boolean'
              ? data.value.payment_type_data?.cash
              : data.value.payment_type === 'cash',
          card_id:
            data.value.payment_type_data?.card_id > 0
              ? data.value.payment_type_data?.card_id
              : data.value.payment_type === 'card',
          balance:
            typeof data.value.payment_type_data?.balance === 'boolean'
              ? data.value.payment_type_data?.balance
              : data.value.payment_type === 'balance',
        },
        shipping_address: {
          address_id: data.value.shipping_address_data?.address_id,
          latitude: null,
          longitude: null,
        },
        recipient: data.value.recipient_data,
      },
    })
    .then(() => {
      showToast(t('auto_order_saved_successfully'), 'success')
    })
    .catch((err) => {
      handleError(err)
    })
    .finally(() => {
      saveLoading.value = false
    })
}

function saveName(item: any) {
  data.value.name = item.name
}

function saveOrderClock(item: any) {
  data.value.delivery_date_data.delivery_time = item.delivery_time
  data.value.delivery_date_data.weekdays = [item.weekdays]
}

function saveUser(item: any) {
  data.value.recipient_data.full_name = item.full_name
  data.value.recipient_data.phone = item.phone
}

function saveAddress(item: any) {
  data.value.shipping_address = item.address_info.address
  data.value.shipping_address_data.address_id = item.id
}

function savePayment(item: any) {
  data.value.payment_type_data = item
  if (item.card_id > 0) {
    data.value.payment_type = 'card'
  } else if (item.balance) {
    data.value.payment_type = 'balance'
  } else if (item.cash) {
    data.value.payment_type = 'cash'
  } else {
    data.value.payment_type = 'card_to_courier'
  }
}
</script>
