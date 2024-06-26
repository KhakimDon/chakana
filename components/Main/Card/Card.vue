<template>
  <div class="flex flex-col justify-between gap-5 cursor-pointer">
    <div>
      <div
        class="w-full h-[113px] rounded-10 bg-white-100 flex-center relative"
        @click="$emit('open')"
      >
        <MainCardBadge
          v-if="card?.discount_type === 'percentage'"
          class="absolute bottom-1.5 left-2"
          :percent="card?.discount_percentage"
          :type="card?.discount_type"
        />
        <nuxt-img
          :src="getImageSize(card?.main_image, 'small')"
          alt="card-image"
          class="w-[135px] h-full object-contain -translate-y-6"
          loading="lazy"
        />
      </div>
      <div v-if="card?.discount_price" class="flex-y-center gap-1">
        <p
          class="mt-2 text-xs leading-[12px] font-medium text-gray-100 line-through"
        >
          {{ formatMoneyDecimal(card?.price) }}
          <span class="text-[11px] font-[150%]">UZS</span>
        </p>
        <p
          v-if="card?.discount_type === 'percentage'"
          class="text-dark leading-120 font-medium text-xs bg-[#FFE81B] rounded px-1 translate-y-1 -rotate-[8deg]"
        >
          {{ card?.discount_percentage }}%
        </p>
      </div>
      <p
        class="mt-2 text-sm leading-122 font-bold text-green"
        :class="{ '!text-red !mt-0': card?.discount_price }"
      >
        {{ formatMoneyDecimal(card?.discount_price ?? card?.price) }}
        <span class="text-[11px] font-[150%]">UZS</span>
      </p>
      <NuxtLinkLocale
        class="mt-2 text-xs leading-122 text-dark font-semibold line-clamp-2 hover:text-orange transition-300"
        :to="'/product/' + card?.id"
      >
        {{ card?.name }}
      </NuxtLinkLocale>
      <p
        v-if="card?.product_uom_amount && card?.product_uom"
        class="mt-1.5 text-gray-100 font-medium text-xs leading-122"
      >
        {{ card?.product_uom_amount }} {{ $t(card?.product_uom) }}
      </p>
    </div>
    <ClientOnly>
      <BaseButton
        v-if="count < 1 || addingToCart"
        class="w-full !py-2"
        :text="$t('to_basket')"
        variant="outline"
        :disabled="addingToCart"
        :loading="addingToCart"
        @click="addToCartFirstTime(card)"
      />
      <MainCardCounter
        v-else
        v-model="count"
        :default-count="count"
        :max="card?.max_quantity ?? 100000"
        readonly
        @click="addToCart(card)"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import type { IProduct } from '~/types/products'
import {
  debounce,
  formatMoneyDecimal,
  getImageSize,
} from '~/utils/functions/common'

interface Props {
  card: IProduct
}

const props = defineProps<Props>()
defineEmits(['open'])

const orderCartStore = useCartOrderStore()
const cartStore = useCartStore()
const count = ref(0)

const addingToCart = ref(false)

const cartProducts = computed(() => cartStore.products)
const addToCart = (product: any) => {
  if (count.value <= product?.max_quantity) {
    debounce(
      'addToCart',
      () => {
        addingToCart.value = true
        orderCartStore
          .addToCart(product?.id, count.value)
          .then(() => {
            cartStore.addToCart(product, count.value)
          })
          .catch(() => {
            if (count.value === 0) {
              count.value = 1
            }
            count.value--
          })
          .finally(() => {
            addingToCart.value = false
          })
      },
      300
    )
  }
}

const addToCartFirstTime = (product: any) => {
  count.value++
  addToCart(product)
}

const cartProduct = computed(() =>
  cartProducts.value.find((product) => product?.id === props.card?.id)
)

watch(
  cartProduct,
  (newValue) => {
    if (newValue) {
      count.value = newValue?.quantity
    }
  },
  { deep: true, immediate: true }
)

watch(
  cartProducts,
  (newValue) => {
    if (newValue.length === 0) {
      count.value = 0
    }
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  if (cartProduct.value) {
    count.value = cartProduct.value?.quantity ?? 0
  }
})
</script>
