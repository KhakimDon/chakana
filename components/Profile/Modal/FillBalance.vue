<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('buy_premium')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="relative">
      <template v-if="success">
        <div
          class="w-[92px] h-[92px] mx-auto flex-center rounded-full bg-[linear-gradient(180deg,_#13B541_0%,_#00992B_100%)] relative mb-6"
        >
          <span
            class="rounded-full border-[3px] border-white/20 absolute inset-0 z-10 pointer-events-none"
          ></span>
          <SvgoCommonTick class="text-white text-[60px]" />
        </div>
        <h3
          class="text-xl leading-130 font-extrabold text-dark text-center mb-2"
        >
          {{ formatMoneyDecimal(59900) }} UZS
        </h3>
        <p
          class="text-sm font-normal leading-140 text-gray-100 text-center mb-6"
        >
          {{ $t('payment_successful') }}
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
                <span
                  v-if="item.subValue"
                  class="text-xs uppercase font-bold"
                  >{{ item.subValue }}</span
                >
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
              {{ formatMoneyDecimal(59900) }}
              <span class="text-sm leading-140">UZS</span>
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="px-5 -mx-5 -mt-3 py-6 bg-gray-300 border-b border-white-100"
        >
          <div
            class="px-3 py-2.5 flex items-center gap-2.5 bg-[linear-gradient(93deg,_#13B541_-3.28%,_#0F8630_67.71%)] rounded-xl relative after:z-[1] after:border-[1.5px] after:border-white/15 after:pointer-events-none after:absolute after:inset-0 after:rounded-xl"
          >
            <SvgoProfileWallet class="text-[32px] leading-8 text-white" />
            <div>
              <p class="text-[10px] font-normal leading-120 text-white/80">
                {{ $t('your_balance') }}
              </p>
              <div class="flex items-end gap-1">
                <p class="text-base font-semibold leading-5 text-white">
                  {{ formatMoneyDecimal(balance) }}
                </p>
                <p class="text-xs leading-120 font-medium text-white">UZS</p>
              </div>
            </div>
            <div class="absolute -top-6 right-1.5 z-[2]">
              <img
                class="relative z-10"
                width="102"
                height="102"
                src="/images/wallet.webp"
                alt="Wallet image"
              />
              <img
                class="absolute inset-0 opacity-60 z-0 blur-[20px]"
                width="102"
                height="102"
                src="/images/wallet.webp"
                alt="Wallet image"
              />
            </div>
          </div>
        </div>
        <div class="border-b border-gray-300 pt-5 pb-3 mb-4">
          <FormGroup :label="$t('amount')">
            <FormInput
              v-model="amount"
              v-maska="moneyMask"
              :placeholder="$t('enter_amount')"
            />
          </FormGroup>
          <div class="flex gap-1 mt-3">
            <button
              v-for="price in prices"
              :key="price"
              class="flex py-1 px-2 rounded-full text-xs font-semibold leading-130 text-dark border-[0.5px] border-gray-200 bg-gray-300 hover:bg-orange/20 hover:border-orange transition-300"
              :class="{
                '!border-orange !bg-orange/20':
                  amount === formatMoneyDecimal(price),
              }"
              @click="amount = formatMoneyDecimal(price)"
            >
              {{ formatMoneyDecimal(price) }}
              UZS
            </button>
          </div>
        </div>
        <div class="border-b border-white-100 -mx-5 px-5 pb-4">
          <div class="flex-y-center gap-1 py-4">
            <SvgoProfileCard class="!text-[#2590BE] text-2xl" />
            <p class="text-sm font-semibold leading-tight text-dark">
              {{ $t('payment_via_card') }}
            </p>
          </div>
          <Transition name="fade" mode="out-in">
            <div :key="cards.loading" class="w-full mb-2">
              <template v-if="cards.loading">
                <ProfileMyCardLoading v-for="i in 4" :key="i" />
              </template>
              <template v-else-if="cards.list.length">
                <div
                  v-for="item in cards.list"
                  :key="item.id"
                  class="flex-y-center gap-1 select-none cursor-pointer group"
                  @click="cardId = item.id"
                >
                  <img
                    width="24"
                    height="24"
                    :src="`/images/svg/payments/${item.processing?.toLowerCase()}.svg`"
                    :alt="item.processing"
                  />
                  <div
                    class="flex-y-center gap-1 border-b border-white-100 py-4 justify-between w-full group-last:border-b-0"
                  >
                    <p class="text-sm font-semibold leading-tight text-dark">
                      {{ item?.card_number }}
                    </p>
                    <div
                      class="border-2 border-gray-200 w-5 h-5 rounded-full mr-3"
                      :class="{
                        'border-orange border-[5px]': cardId === item.id,
                      }"
                    />
                  </div>
                </div>
              </template>
            </div>
          </Transition>
          <BaseButton
            class="!py-1.5 w-full group"
            variant="secondary"
            :text="$t('add_card')"
            size="md"
            @click="addCardModal = true"
          >
            <template #prefix>
              <SvgoCommonPlus
                class="text-dark text-xl transition-300 group-hover:text-orange"
              />
            </template>
          </BaseButton>
        </div>
        <div class="flex-y-center gap-1 my-2.5">
          <SvgoProfileCoins class="text-orange text-2xl" />
          <p class="text-sm font-semibold leading-tight text-dark">
            {{ $t('payment_system') }}
          </p>
        </div>
        <CommonPaymentTypes
          v-model="paymentType"
          :providers="paymentProviders"
        />
        <BaseButton
          class="!py-3 w-full !mt-6"
          :loading
          :text="$t('save')"
          size="md"
          @click="add"
        />
      </template>
      <div
        class="absolute inset-0 z-10 bg-white/80 backdrop-blur-[2px] -m-4 rounded-b-xl flex-center opacity-0 pointer-events-none transition-300"
        :class="{ '!opacity-100 !pointer-events-auto': loading }"
      >
        <SvgoLoading
          class="animate-spin text-[40px] leading-10 text-gray-100"
        />
      </div>
    </div>
    <ProfileModalCardAdd v-model="addCardModal" @finish="addedCard" />
  </BaseModal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import { usePaymentStore } from '~/store/payment.js'
import { useCardsStore } from '~/store/profile/cards.js'
import { useSubscriptionsStore } from '~/store/profile/subscription.js'
import { formatMoneyDecimal, moneyMask } from '~/utils/functions/common.js'

interface Props {
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()

const prices = [50000, 100000, 150000]

const loading = ref(false)
const success = ref(true)
const amount = ref(0)
const balance = ref(false)
const cardId = ref(0)
const paymentType = ref(0)

watch(
  () => balance.value,
  (val) => {
    if (val) {
      paymentType.value = 0
      cardId.value = 0
    }
  }
)

watch(
  () => paymentType.value,
  (val) => {
    if (val) {
      balance.value = false
      cardId.value = 0
    }
  }
)

watch(
  () => cardId.value,
  (val) => {
    if (val) {
      balance.value = false
      paymentType.value = 0
    }
  }
)

const subscriptionStore = useSubscriptionsStore()
function add() {
  // subscriptionStore.getSubscription()
  const data = {
    card_id: cardId.value,
    is_use_balance: balance.value,
    provider: paymentType.value,
  }
  console.log(balance.value, cardId.value, paymentType.value)
  // emit('update:modelValue', false)
}

const paymentStore = usePaymentStore()

onMounted(() => {
  paymentStore.getPaymentProviderList()
})

const paymentProviders = computed(() => paymentStore.paymentProviders.list)

const cardsStore = useCardsStore()
const cards = computed(() => cardsStore.cards)
const addCardModal = ref(false)
function addedCard() {
  addCardModal.value = false
  cardsStore.fetchCards()
}

cardsStore.fetchCards()

const infoList = computed(() => [
  {
    title: t('payment_way'),
    value: 'Paylov',
  },
  {
    title: t('commission'),
    value: '0%',
  },
  {
    title: t('transfer_date'),
    value: dayjs(new Date()).format('DD.MM.YYYY, HH:mm:ss'),
  },
  {
    title: t('amount'),
    value: formatMoneyDecimal(amount.value),
    subValue: 'uzs',
  },
])
</script>
