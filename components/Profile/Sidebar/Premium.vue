<template>
  <div class="rounded-2xl sidebar-premium p-px overflow-hidden">
    <div class="p-3 pt-4 bg-white rounded-[15px] flex flex-col items-center">
      <div class="relative">
        <img
          class="relative z-10"
          width="55"
          height="45"
          src="/images/svg/star-dynamic-premium.webp"
          alt="star dynamic premium"
        />
        <img
          class="absolute z-0 inset-0 opacity-70 blur-[17px]"
          width="55"
          height="45"
          src="/images/svg/star-dynamic-premium.webp"
          alt="star dynamic premium"
        />
      </div>
      <i18n-t
        keypath="more_discounts_and_coupons_with_premium_subscription"
        tag="p"
        class="text-sm text-dark font-medium leading-130 mt-2 mb-4 text-center"
      >
        <template #premium>
          <span class="font-semibold premium-text uppercase">
            {{ subscription.title }}
          </span>
        </template>
      </i18n-t>
      <div
        class="mb-3 py-2.5 px-3 border border-white-100 rounded-lg w-full flex-y-center gap-2"
      >
        <SvgoProfileSidebarMoney class="text-xl leading-5 text-green" />
        <p class="text-xs font-normal leading-130 text-gray-100">
          {{ $t('price') }}:
          <span class="font-bold text-green">
            {{ formatMoneyDecimal(subscription.price) }} {{ $t('sum') }}
          </span>
        </p>
      </div>
      <BaseButton
        class="w-full"
        :text="$t('get_access')"
        @click="premiumModal = true"
      ></BaseButton>
    </div>
    <BaseModal v-model="premiumModal" no-header has-close>
      <div>
        <div class="relative mb-7">
          <img
            class="relative z-10 mx-auto"
            width="115"
            height="84"
            src="/images/svg/star-dynamic-premium.webp"
            alt="star dynamic premium"
          />
          <img
            class="absolute z-0 top-0 left-1/2 -translate-x-1/2 opacity-70 blur-[17px]"
            width="115"
            height="84"
            src="/images/svg/star-dynamic-premium.webp"
            alt="star dynamic premium"
          />
        </div>
        <i18n-t
          keypath="more_discounts_and_coupons_with_premium_subscription"
          tag="h2"
          class="text-xl font-bold leading-130 text-dark whitespace-pre-line text-center"
        >
          <template #premium>
            <span class="premium-text uppercase font-extrabold">
              {{ subscription.title }}
            </span>
          </template>
        </i18n-t>
        <div class="my-5 p-3 bg-gray-300 rounded-xl w-full flex-y-center gap-2">
          <SvgoProfileSidebarMoney class="text-[28px] leading-7 text-green" />
          <p class="text-base font-normal leading-130 text-gray-100">
            {{ $t('price') }}:
            <span class="font-bold text-green">
              {{ formatMoneyDecimal(subscription.price) }} {{ $t('sum') }}
            </span>
          </p>
        </div>
        <div class="flex flex-col">
          <PaymentCardInfo
            v-for="(feature, index) in features"
            :key="index"
            no-clickable
            v-bind="feature"
            icon-class="!text-2xl !leading-6 text-orange"
            class="group"
            title-class="group-hover:!text-dark"
            text-wrapper-class="group-last:border-none"
          />
        </div>
        <BaseButton
          :text="$t('buy_premium')"
          class="mt-5 !py-1.5 w-full"
          @click="subscriptionModal = true"
        >
          <template #prefix>
            <SvgoProfileSidebarCrownStroke class="text-2xl leading-6" />
          </template>
        </BaseButton>
      </div>
    </BaseModal>
    <ProfileModalGetPremium v-model="subscriptionModal" :subscription />
  </div>
</template>

<script setup lang="ts">
import { useSubscriptionsStore } from '~/store/profile/subscription.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const premiumModal = ref(false)
const subscriptionModal = ref(false)

const subscriptionsStore = useSubscriptionsStore()
const subscription = computed(() => subscriptionsStore.subscription)

await useAsyncData('subscription', subscriptionsStore.fetchSubscription)

const { t } = useI18n()

const features = [
  {
    icon: 'SvgoCommonDTruck',
    title: t('free_deliver'),
  },
  {
    icon: 'SvgoProfileHelpHexagon',
    title: t('priority_help'),
  },
  {
    icon: 'SvgoProfileNorthStar',
    title: t('exclusive_offers'),
  },
  {
    icon: 'SvgoProfileUserStar',
    title: t('personalized_recommendations'),
  },
  {
    icon: 'SvgoProfileGift',
    title: t('bonus_gifts_for_holidays'),
  },
]
</script>

<style>
.sidebar-premium {
  background: linear-gradient(180deg, #ff831b 0%, #f30 100%);
  box-shadow: 0 3.97px 12px 0 #0000000f, 0 10px 80px 0 #0000000f;
}
.premium-text {
  background: -webkit-linear-gradient(180deg, #ff831b 0%, #f30 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
