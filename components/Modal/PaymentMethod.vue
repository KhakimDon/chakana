<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('payment_method')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div>
      <div
        class="flex-y-center gap-1 select-none cursor-pointer"
        @click="courierCard = !courierCard"
      >
        <SvgoProfileUser class="text-orange text-2xl" />
        <div
          class="flex-y-center gap-1 border-b border-white-100 py-4 justify-between w-full"
        >
          <p class="text-sm font-semibold leading-tight text-dark">
            {{ $t('courier_card') }}
          </p>
          <FormRadio v-if="!courierCard" v-model="courierCard" class="!p-0" />
          <FormRadio v-else class="!p-0" />
        </div>
      </div>
      <div
        class="flex-y-center gap-1 select-none cursor-pointer"
        @click="cash = !cash"
      >
        <SvgoProfileMoney class="text-green text-2xl" />
        <div
          class="flex-y-center gap-1 border-b border-white-100 py-4 justify-between w-full"
        >
          <p class="text-sm font-semibold leading-tight text-dark">
            {{ $t('cash') }}
          </p>
          <FormRadio v-if="!cash" v-model="cash" class="!p-0" />
          <FormRadio v-else class="!p-0" />
        </div>
      </div>
      <div>
        <div class="flex-y-center gap-1 my-4">
          <SvgoProfileCard class="!text-blue-100 text-2xl" />
          <p class="text-sm font-semibold leading-tight text-dark">
            {{ $t('payment_via_card') }}
          </p>
        </div>
        <Transition name="fade" mode="out-in">
          <div :key="cards.loading" class="w-full mb-3">
            <template v-if="cards.loading">
              <ProfileMyCardLoading v-for="i in 4" :key="i" />
            </template>
            <template v-else-if="cards.list.length">
              <div
                v-for="item in cards.list"
                :key="item.id"
                class="flex-y-center gap-1 select-none cursor-pointer"
                @click="cardId = item.id"
              >
                <img
                  width="24"
                  height="24"
                  :src="`/images/svg/payments/${item.processing?.toLowerCase()}.svg`"
                  :alt="item.processing"
                />
                <div
                  class="flex-y-center gap-1 border-b border-white-100 py-4 justify-between w-full"
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
            <template v-else>
              <CommonNoData
                class="col-span-2"
                :title="$t('no_cards_yet')"
                :subtitle="$t('you_still_dont_have_cards')"
              >
                <template #actions>
                  <BaseButton
                    class="mt-4"
                    :text="$t('add_card')"
                    @click="addCardModal = true"
                  />
                </template>
              </CommonNoData>
            </template>
          </div>
        </Transition>
        <BaseButton
          class="!py-3 w-full group"
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
      <div class="flex-y-center gap-1 my-4">
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
import { useCartOrderStore } from '~/store/cart_order.js'
import { usePaymentStore } from '~/store/payment.js'
import { useCardsStore } from '~/store/profile/cards.js'

interface Props {
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const loading = ref(false)
const courierCard = ref(false)
const cash = ref(false)
const cardId = ref(0)
const paymentType = ref(0)

watch(
  () => cash.value,
  (val) => {
    if (val) {
      courierCard.value = false
      paymentType.value = 0
      cardId.value = 0
    }
  }
)

watch(
  () => courierCard.value,
  (val) => {
    if (val) {
      cash.value = false
      paymentType.value = 0
      cardId.value = 0
    }
  }
)

watch(
  () => paymentType.value,
  (val) => {
    if (val) {
      cash.value = false
      courierCard.value = false
      cardId.value = 0
    }
  }
)

watch(
  () => cardId.value,
  (val) => {
    if (val) {
      cash.value = false
      courierCard.value = false
      paymentType.value = 0
    }
  }
)

const orderCartStore = useCartOrderStore()
function add() {
  orderCartStore.orderDetail.payment_method.provider_id = paymentType.value
  orderCartStore.orderDetail.payment_method.cash = cash.value
  orderCartStore.orderDetail.payment_method.card_to_the_courier =
    courierCard.value
  orderCartStore.orderDetail.payment_method.card_id = cardId.value

  emit('update:modelValue', false)
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
