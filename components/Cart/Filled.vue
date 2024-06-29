<template>
  <section class="space-y-5 mt-5">
    <CartCardFreeDelivery :cart-total-price="totalCartPrice" />

    <p class="text-xl font-extrabold text-dark">{{ $t('basket') }}</p>
    <div class="space-y-5">
      <div class="flex-y-center justify-between">
        <p class="text-sm font-semibold leading-130 text-dark">
          {{ t('cary_products', { count: cartProducts.length }) }}
        </p>
        <div
          class="flex-center gap-2 group cursor-pointer select-none"
          :class="{ 'pointer-events-none': loading }"
          @click="showDeleteConfirm = true"
        >
          <svg
            v-if="loading"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="animate-spin"
          >
            <path
              d="M18.6705 10C19.4048 10 20.0091 10.5978 19.9118 11.3256C19.7101 12.8333 19.1663 14.2813 18.3147 15.5557C17.2159 17.2002 15.6541 18.4819 13.8268 19.2388C11.9996 19.9957 9.98891 20.1937 8.0491 19.8079C6.10929 19.422 4.32746 18.4696 2.92894 17.0711C1.53041 15.6725 0.578004 13.8907 0.192152 11.9509C-0.193701 10.0111 0.00433284 8.00043 0.761209 6.17317C1.51809 4.3459 2.79981 2.78412 4.4443 1.6853C5.71875 0.833744 7.16671 0.289884 8.6744 0.0882432C9.40217 -0.00909153 10 0.595234 10 1.32949C10 2.06375 9.39999 2.64679 8.67774 2.77904C7.69697 2.95865 6.75831 3.33706 5.92155 3.89617C4.71433 4.70281 3.77341 5.84932 3.21779 7.19071C2.66217 8.53211 2.51679 10.0081 2.80004 11.4322C3.0833 12.8562 3.78246 14.1642 4.80912 15.1909C5.83578 16.2175 7.14383 16.9167 8.56784 17.2C9.99186 17.4832 11.4679 17.3378 12.8093 16.7822C14.1507 16.2266 15.2972 15.2857 16.1038 14.0784C16.6629 13.2417 17.0414 12.303 17.221 11.3223C17.3532 10.6 17.9363 10 18.6705 10Z"
              fill="#FF831B"
            />
          </svg>
          <SvgoCommonTrash
            v-else
            class="text-base text-gray-100 group-hover:text-red transition-300"
          />
          <p
            class="text-xs font-semibold text-gray-100 group-hover:text-red transition-300"
          >
            {{ $t('clear_all') }}
          </p>
        </div>
      </div>
      <div class="max-h-72 h-fit overflow-y-auto space-y-5">
        <SearchCardProduct
          v-for="(product, key) in cartProducts"
          :key
          :product="product"
          class="!p-0"
          title-class="line-clamp-2"
          :class="{ '!mt-5': key === 0 }"
        />
      </div>
    </div>
    <div
      class="mt-5 border-t border-gray-200 mb-6 pt-5 flex-y-center justify-between"
    >
      <p class="text-base font-semibold leading-normal text-gray-100">
        {{ $t('total_price') }}
      </p>
      <p
        class="text-dark whitespace-nowrap line-clamp-1 text-xl font-bold leading-normal"
      >
        {{ formatMoneyDecimal(totalCartPrice, 0) }}
        <span class="text-xs font-bold text-gray-100 leading-snug"> UZS </span>
      </p>
    </div>
    <BaseButton class="w-full !rounded-10" variant="primary" @click="goToCart">
      <p class="space-x-1">
        <span>{{ $t('go_to_cart') }}</span>
        <span
          class="p-0.5 bg-white/25 rounded-md px-1 text-white text-xs font-medium leading-tight"
          >{{ formatMoneyDecimal(totalCartPrice, 0) }} UZS</span
        >
      </p>
    </BaseButton>
    <DeleteConfirm v-model="showDeleteConfirm" @do-action="clearCart" />
  </section>
</template>

<script setup lang="ts">
import DeleteConfirm from '~/components/Common/Modal/DeleteConfirm.vue'
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const router = useRouter()
const { t, locale } = useI18n()
const cartStore = useCartStore()
const cartProducts = computed(() => cartStore.products)

const showDeleteConfirm = ref(false)

const orderCartStore = useCartOrderStore()

const clearCart = () => {
  showDeleteConfirm.value = false
  orderCartStore.cartClear().then(() => {
    cartStore.products = []
  })
}

const totalCartPrice = computed(
  () => orderCartStore.cart?.detail?.total_price ?? 0
)

const loading = computed(() => orderCartStore.clearingCart)

const goToCart = () => {
  router.push(`/${locale.value}/cart`)
}

orderCartStore.getCartDetail()
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 0;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgba(136, 136, 136, 0);
  border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ff831b;
  border-radius: 5px;
}
</style>
