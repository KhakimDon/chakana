<template>
  <nav
    class="fixed left-0 right-0 px-10 py-2.5 pb-7 bottom-0 w-full bg-gradient-to-t from-white from-80% to-transparent z-10 flex items-center"
  >
    <div class="flex items-center justify-between w-full pt-5">
      <div class="w-9 h-9 rounded-full cursor-pointer" @click="openSaved">
        <IconHeart class="text-[28px] text-gray-100" />
      </div>
      <NuxtLinkLocale
        to="/cart"
        class="flex-y-center px-4 h-[44px] gap-2 py-2 bg-green rounded-full text-white"
      >
        <SvgoCommonCart class="text-[28px]" />
        <div v-if="total > 0">
          <p class="text-white text-[10px] font-bold leading-3">
            {{ formatMoneyDecimal(totalPrice, 0) }}
            <span
              class="text-white/60 text-white text-[10px] font-bold leading-3"
              >{{ $t('sum') }}</span
            >
          </p>
          <p class="text-white/60 text-[10px] font-medium leading-3">
            {{ t('cary_products', { count: total }) }}
          </p>
        </div>
        <p v-else class="text-white text-[15px] font-bold leading-tight">
          {{ $t('basket') }}
        </p>
      </NuxtLinkLocale>
      <div
        class="w-9 h-9 rounded-full linear-border-image cursor-pointer"
        @click="openProfile"
      >
        <img
          v-if="user?.image"
          :src="user?.image"
          alt="user"
          class="w-full h-full object-cover object-center rounded-full"
        />
        <img
          v-else
          class="w-full h-full"
          src="/images/default/user.png"
          alt="user-default"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import IconHeart from '~/assets/icons/Common/heart-stroke.svg'
import { useAuthStore } from '~/store/auth.js'
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

const authStore = useAuthStore()
const cartStore = useCartStore()
const cartOrderStore = useCartOrderStore()

const { t, locale } = useI18n()

const router = useRouter()
const cartProducts = computed(() => cartStore.products)

cartOrderStore.getCartDetail()

const total = computed(() =>
  cartProducts.value.reduce((acc, product) => acc + product?.quantity, 0)
)

const totalPrice = computed(() => cartOrderStore.cart?.detail?.total_price)

const token = computed(() => authStore.accessToken)
const user = computed(() => authStore.user)

watch(
  () => user.value?.id,
  () => {
    console.log('change')
    cartOrderStore.getCartDetail()
  }
)

const openSaved = () => {
  if (token.value) {
    router.push(`/${locale.value}/saved`)
  } else {
    authStore.showAuth = true
  }
}

const openProfile = () => {
  if (token.value) {
    router.push(`/${locale.value}/profile`)
  } else {
    authStore.showAuth = true
  }
}

cartStore.getCartProducts()
</script>

<style scoped>
.linear-border-image {
  background: radial-gradient(
        circle at 100% 100%,
        #ffffff 0,
        #ffffff 17px,
        transparent 17px
      )
      0 0/19px 19px no-repeat,
    radial-gradient(circle at 0 100%, #ffffff 0, #ffffff 17px, transparent 17px)
      100% 0/19px 19px no-repeat,
    radial-gradient(circle at 100% 0, #ffffff 0, #ffffff 17px, transparent 17px)
      0 100%/19px 19px no-repeat,
    radial-gradient(circle at 0 0, #ffffff 0, #ffffff 17px, transparent 17px)
      100% 100%/19px 19px no-repeat,
    linear-gradient(#ffffff, #ffffff) 50% 50% / calc(100% - 4px)
      calc(100% - 38px) no-repeat,
    linear-gradient(#ffffff, #ffffff) 50% 50% / calc(100% - 38px)
      calc(100% - 4px) no-repeat,
    linear-gradient(#ff831b 0%, #ff3300 100%);
  border-radius: 19px;
  padding: 2px;
  box-sizing: border-box;
}
</style>
