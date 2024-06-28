<template>
  <div>
    <div
      class="flex-y-center gap-1 select-none cursor-pointer"
      @click="values.card_to_courier = !values.card_to_courier"
    >
      <SvgoProfileUser class="text-orange text-2xl" />
      <div
        class="flex-y-center gap-1 border-b border-white-100 py-4 justify-between w-full"
      >
        <p class="text-sm font-semibold leading-tight text-dark">
          {{ $t('courier_card') }}
        </p>
        <FormRadio
          v-if="!values.card_to_courier"
          v-model="values.card_to_courier"
          class="!p-0"
        />
        <FormRadio v-else class="!p-0" />
      </div>
    </div>
    <div
      class="flex-y-center gap-1 select-none cursor-pointer"
      @click="values.cash = !values.cash"
    >
      <SvgoProfileMoney class="text-green text-2xl" />
      <div
        class="flex-y-center gap-1 border-b border-white-100 py-4 justify-between w-full"
      >
        <p class="text-sm font-semibold leading-tight text-dark">
          {{ $t('cash') }}
        </p>
        <FormRadio v-if="!values.cash" v-model="values.cash" class="!p-0" />
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
              @click="values.card_id = item.id"
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
                    'border-orange border-[5px]': values.card_id === item.id,
                  }"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <p
              class="text-center py-3 text-xs text-gray-100 font-normal leading-none"
            >
              {{ $t('no_cards_yet') }}
            </p>
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
    <CommonPaymentTypes
      v-model="values.provider_id"
      :providers="paymentProviders"
    />
    <ProfileModalCardAdd v-model="addCardModal" @finish="addedCard" />
  </div>
</template>
<script setup lang="ts">
import { usePaymentStore } from '~/store/payment.js'
import { useCardsStore } from '~/store/profile/cards.js'

interface Props {
  form: any
  isAuto?: boolean
}
const props = defineProps<Props>()

const { values } = unref(props.form)

watch(
  () => values.cash,
  (val) => {
    if (val) {
      values.card_to_courier = false
      values.provider_id = 0
      values.card_id = 0
    }
  }
)

watch(
  () => values.card_to_courier,
  (val) => {
    if (val) {
      values.cash = false
      values.provider_id = 0
      values.card_id = 0
    }
  }
)

watch(
  () => values.provider_id,
  (val) => {
    if (val) {
      values.cash = false
      values.card_to_courier = false
      values.card_id = 0
      values.provider_info = paymentProviders.value.find((e) => e.id === val)
    }
  }
)

watch(
  () => values.card_id,
  (val) => {
    if (val) {
      values.cash = false
      values.card_to_courier = false
      values.provider_id = 0
    }
  }
)

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
