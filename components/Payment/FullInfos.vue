<template>
  <Transition name="fade" mode="out-in">
    <div :key="$route.name">
      <div class="flex-y-center gap-1 cursor-pointer" @click="goBack">
        <SvgoCommonChevron class="text-base text-gray-100" />
        <p class="text-sm font-semibold text-gray-100">
          {{ $t('go_back') }}
        </p>
      </div>
      <div class="flex-y-center justify-between mt-3">
        <p class="text-[22px] font-extrabold leading-7">
          {{
            orderCartStore.orderDetail?.isAuto
              ? $t('placing_auto_order')
              : $t('placing_order')
          }}
        </p>
      </div>
      <div class="w-full my-6 space-y-6">
        <PaymentCardInfoHeader :title="$t('delivery_details')">
          <section>
            <PaymentSectionAddress
              :default-address="orderCartStore.orderDetail?.address_info"
              @save="saveAddress"
            />
            <PaymentSectionClockLocation
              v-if="!orderCartStore.orderDetail?.isAuto"
              :default-info="orderCartStore.orderDetail"
              :is-auto="orderCartStore.orderDetail?.isAuto"
              @save="saveOrderClock"
            />
            <PaymentSectionUserData
              :full_name="orderCartStore.orderDetail?.full_name"
              :phone="orderCartStore.orderDetail?.phone"
              @save="saveUser"
            />
            <PaymentSectionCommentForCurier
              :comment="orderCartStore.orderDetail?.comment_to_courier"
              :subtitle="$t('courier_comment')"
              @save="saveComment"
            />
            <PaymentSectionCommentForCurier
              :comment="orderCartStore.orderDetail?.picker_comment"
              :subtitle="$t('picker_comment')"
              is-picker
              @save="savePickerComment"
            />
          </section>
        </PaymentCardInfoHeader>

        <PaymentCardInfoHeader :title="$t('payment_method')">
          <PaymentSectionPaymentMethod
            :default-data="orderCartStore.orderDetail"
            @save="savePayment"
          />
        </PaymentCardInfoHeader>
        <PaymentSectionPromoCode
          :default-data="orderCartStore.orderDetail"
          @save="selectPromoCode"
        />
        <div class="flex-y-center gap-3 select-none cursor-pointer relative">
          <div class="shrink-0 flex-center">
            <SvgoProfileWallet class="text-2xl text-green-600" />
          </div>
          <div class="flex-y-center group justify-between py-2 w-full h-[52px]">
            <div class="space-y-1">
              <p class="text-sm font-semibold leading-tight text-dark">
                {{ $t('use_balance') }}
              </p>
              <p class="text-xs font-normal leading-none text-gray-100">
                {{
                  t('card_price', {
                    price: formatMoneyDecimal(balancePrice, 0),
                  })
                }}
              </p>
            </div>
            <FormToggle
              v-model="useBalance"
              class="text-2xl"
              @change="toggleUseBalance"
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import { useAuthStore } from '~/store/auth.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { useBalanceStore } from '~/store/profile/balance.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const { t } = useI18n()
const router = useRouter()

const authStore = useAuthStore()
const orderCartStore = useCartOrderStore()

function saveAddress(data: any) {
  orderCartStore.orderDetail.address_info = data.address_info
  orderCartStore.orderDetail.id = data.address_info.id
}

function saveUser(data: any) {
  orderCartStore.orderDetail.full_name = data.full_name || authStore.user?.name
  orderCartStore.orderDetail.phone =
    data.phone || authStore.user?.phone?.slice(4, authStore.user?.phone?.length)
}

function saveComment(data: any) {
  orderCartStore.orderDetail.comment_to_courier = data.comment_to_courier
}

function savePickerComment(data: any) {
  orderCartStore.orderDetail.picker_comment = data.comment_to_courier
}

function savePayment(data: any) {
  // orderCartStore.orderDetail.card_to_courier = data.card_to_courier
  orderCartStore.orderDetail.cash = data.cash
  orderCartStore.orderDetail.card_id = data.card_id
  orderCartStore.orderDetail.provider_id = data.provider_id
}

const selectPromoCode = (item: any) => {
  orderCartStore.orderDetail.promo_code_id = item.promo_code_id
  orderCartStore.orderDetail.promo_info = item.promo_info
  orderCartStore.getCartDetailConfirm({
    promo_code_id: item.promo_code_id,
  })
}

function getExpressDeliveryPrice(data: any) {
  const now = dayjs()
  if (data?.delivery_time) {
    const deliveryTime =
      data.delivery_time === 'nearest_2_hours'
        ? dayjs(now.add(2, 'hours')).format('DD.MM.YYYY HH:mm:ss')
        : dayjs(data.delivery_time).format('DD.MM.YYYY HH:mm:ss')

    const query = orderCartStore.orderDetail.promo_code_id
      ? {
          promo_code_id: orderCartStore.orderDetail.promo_code_id,
          when_to_deliver: deliveryTime,
        }
      : {
          when_to_deliver: deliveryTime,
        }

    orderCartStore.getCartDetailConfirm(query)
  }

  const query = {
    when_to_deliver: dayjs(
      now.add(2, 'hours').set('minutes', 0).set('seconds', 0)
    ).format('DD.MM.YYYY HH:mm:ss'),
  }

  orderCartStore.getCartDetailConfirm(query)
}

function saveOrderClock(data: any) {
  orderCartStore.orderDetail.delivery_time = data.delivery_time
  orderCartStore.orderDetail.weekdays = data.weekdays

  getExpressDeliveryPrice(data)
}

const useBalance = ref(false)

const toggleUseBalance = () => {
  useBalance.value = !useBalance.value
  orderCartStore.orderDetail.balance = useBalance.value
}

const balanceStore = useBalanceStore()
const balancePrice = computed(() => balanceStore.balance)
await useAsyncData('balance', () => balanceStore.fetchBalance())

const goBack = () => {
  router.back()
}

getExpressDeliveryPrice(orderCartStore.orderDetail)
</script>
