<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('buy_premium')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div>
      <div class="p-4 rounded-xl bg-gray-300 mb-2">
        <h3 class="text-base font-extrabold leading-130 text-dark mb-4">
          {{ $t('ticket_for_payment') }}
        </h3>
        <div
          class="flex items-end justify-between pb-4 border-b text-gray-200 mb-4"
        >
          <p class="text-dark font-semibold leading-130 text-sm">
            {{ $t('premium_subscription') }}
          </p>
          <p
            class="flex items-end gap-1 text-sm font-bold leading-130 text-dark"
          >
            {{ formatMoneyDecimal(subscription.price) }}
            <span class="text-xs">UZS</span>
          </p>
        </div>
        <div class="flex items-end justify-between">
          <p class="text-dark font-extrabold leading-130 text-base">
            {{ $t('total_sum') }}
          </p>
          <p
            class="flex items-end gap-1 text-xl font-extrabold leading-130 text-green"
          >
            {{ formatMoneyDecimal(subscription.price) }}
            <span class="text-sm">UZS</span>
          </p>
        </div>
      </div>

      <div class="border-b border-white-100 -mx-5 px-5 pb-4">
        <div class="flex-y-center gap-1 py-4">
          <SvgoProfileCard class="!text-blue-100 text-2xl" />
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
      <div
        class="flex-y-center gap-1 select-none cursor-pointer border-b border-white-100 -mx-5 px-5"
        @click="balance = true"
      >
        <SvgoProfileWallet class="text-blue-100 text-2xl" />
        <div class="flex-y-center gap-1 py-3 justify-between w-full">
          <div>
            <p class="text-sm font-semibold leading-tight text-dark">
              {{ $t('use_balance') }}
            </p>
            <p class="text-xs leading-130 font-normal text-gray-100">
              {{
                $t('card_price', { price: formatMoneyDecimal(balanceAmount) })
              }}
            </p>
          </div>
          <FormRadio v-if="!balance" v-model="balance" class="!p-0" />
          <FormRadio v-else class="!p-0" />
        </div>
      </div>
      <div class="flex-y-center gap-1 my-2.5">
        <SvgoProfileCoins class="text-orange text-2xl" />
        <p class="text-sm font-semibold leading-tight text-dark">
          {{ $t('payment_system') }}
        </p>
      </div>
      <CommonPaymentTypes v-model="paymentType" :providers="paymentProviders" />
      <BaseButton
        class="!py-3 w-full !mt-6"
        :loading
        :text="$t('save')"
        size="md"
        @click="add"
      />
    </div>
    <ProfileModalCardAdd v-model="addCardModal" @finish="addedCard" />
  </BaseModal>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth.js'
import { usePaymentStore } from '~/store/payment.js'
import { useBalanceStore } from '~/store/profile/balance.js'
import { useCardsStore } from '~/store/profile/cards.js'
import {
  type ISubscription,
  useSubscriptionsStore,
} from '~/store/profile/subscription.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  modelValue: boolean
  subscription: ISubscription
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const { handleError } = useErrorHandling()
const { showToast } = useCustomToast()
const { t } = useI18n()

const balanceAmount = computed(() => useBalanceStore().balance)

const loading = ref(false)
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
const authStore = useAuthStore()
function add() {
  // subscriptionStore.getSubscription()
  const data = {
    card_id: cardId.value || undefined,
    is_use_balance: balance.value,
    provider: paymentType.value || undefined,
  }
  subscriptionStore
    .getSubscription(data)
    .then(() => {
      showToast(t('you_bought_premium'), 'success')
      authStore.fetchUser()
      emit('update:modelValue', false)
      emit('close')
    })
    .catch((err) => {
      handleError(err)
    })
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
</script>
