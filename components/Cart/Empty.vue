<template>
  <section class="relative">
    <div v-if="loading" class="absolute h-full w-full rounded-10 backdrop-blur">
      <span
        class="absolute-center text-orange z-10 !inline-block w-max h-max loading transition-300"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="animate-spin"
        >
          <path
            d="M18.6705 10C19.4048 10 20.0091 10.5978 19.9118 11.3256C19.7101 12.8333 19.1663 14.2813 18.3147 15.5557C17.2159 17.2002 15.6541 18.4819 13.8268 19.2388C11.9996 19.9957 9.98891 20.1937 8.0491 19.8079C6.10929 19.422 4.32746 18.4696 2.92894 17.0711C1.53041 15.6725 0.578004 13.8907 0.192152 11.9509C-0.193701 10.0111 0.00433284 8.00043 0.761209 6.17317C1.51809 4.3459 2.79981 2.78412 4.4443 1.6853C5.71875 0.833744 7.16671 0.289884 8.6744 0.0882432C9.40217 -0.00909153 10 0.595234 10 1.32949C10 2.06375 9.39999 2.64679 8.67774 2.77904C7.69697 2.95865 6.75831 3.33706 5.92155 3.89617C4.71433 4.70281 3.77341 5.84932 3.21779 7.19071C2.66217 8.53211 2.51679 10.0081 2.80004 11.4322C3.0833 12.8562 3.78246 14.1642 4.80912 15.1909C5.83578 16.2175 7.14383 16.9167 8.56784 17.2C9.99186 17.4832 11.4679 17.3378 12.8093 16.7822C14.1507 16.2266 15.2972 15.2857 16.1038 14.0784C16.6629 13.2417 17.0414 12.303 17.221 11.3223C17.3532 10.6 17.9363 10 18.6705 10Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
    <div class="mt-5 bg-white-100 rounded-10 p-4">
      <p class="text-lg font-bold leading-normal text-dark">
        {{ $t('basket') }}
      </p>
      <CommonNoData
        image="/images/svg/cart.svg"
        title="empty_basket"
        subtitle="empty_basket_text"
        title-class="!max-w-full"
        subtitle-class="!max-w-full"
      />
    </div>
    <div
      v-if="false"
      class="mt-5 flex-y-center bg-white-100 justify-between rounded-10 py-2 px-3"
    >
      <p class="text-xs font-normal text-gray-100 leading-none">
        {{ $t('go_payment') }}
      </p>
      <p class="text-xs font-bold leading-snug text-gray-100">
        <span class="text-base font-bold text-dark leading-normal">
          {{ formatMoneyDecimal(0, 0) }}
        </span>
        UZS
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const cartStore = useCartStore()

const loading = computed(() => cartStore.cartProductsLoading)
</script>

<style scoped></style>
