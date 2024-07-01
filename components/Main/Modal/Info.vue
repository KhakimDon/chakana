<template>
  <BaseModal
    v-bind="{ show }"
    no-header
    body-class="!max-w-[484px]"
    @close="$emit('close')"
  >
    <div class="flex justify-end w-full mb-5">
      <IconClose
        class="text-2xl text-dark cursor-pointer hover:text-red transition-300"
        @click="$emit('close')"
      />
    </div>
    <div class="w-full h-[278px] rounded-10 bg-white-100 mb-4 flex-center">
      <NuxtImg
        :src="product?.main_image"
        class="w-full h-full object-contain max-w-[296px]"
      />
    </div>

    <h3 class="text-base leading-130 font-bold text-dark">
      {{ product?.name }}
    </h3>
    <p class="mt-1.5 text-xs leading-130 font-medium text-gray-100 mb-4">
      {{ product?.weight }} {{ product?.weight_measure }}
    </p>

    <div>
      <div class="flex items-end gap-1">
        <p
          v-if="product?.discount_price"
          class="text-lg leading-4 font-medium text-gray-100 line-through"
        >
          {{ formatMoneyDecimal(product?.price) }}
        </p>
        <span
          class="text-xs leading-[94%] font-medium text-gray-100 line-through"
          >UZS</span
        >
      </div>
      <p
        class="text-[28px] leading-122 font-bold text-green mt-1"
        :class="{ '!text-red !mt-0': product?.discount_price }"
      >
        {{ formatMoneyDecimal(product?.discount_price ?? product?.price) }}
        <span class="text-[22px] font-semibold leading-130">UZS</span>
      </p>
    </div>

    <div class="w-full h-px bg-white-100 my-4" />

    <div class="flex-y-center gap-2.5 mb-5">
      <IconInfo class="text-green text-2xl" />

      <p class="text-sm leading-130 font-semibold text-dark">
        {{ $t('product_to_card_text') }}
      </p>
    </div>

    <ClientOnly>
      <BaseButton
        v-if="count < 1 || addingToCart"
        class="w-full"
        :text="
          product?.quantity > 0 && product?.max_quantity > 0
            ? $t('to_basket')
            : $t('out_of_stock')
        "
        variant="outline"
        :disabled="
          addingToCart || !(product?.quantity > 0 && product?.max_quantity > 0)
        "
        :loading="addingToCart"
        @click="addToCartFirstTime(product)"
      />
      <MainCardCounter
        v-else
        v-model="count"
        :default-count="count"
        :max="product?.max_quantity ?? 100000"
        readonly
        @click="addToCart(product)"
      />
    </ClientOnly>
  </BaseModal>
</template>

<script setup lang="ts">
import IconClose from '~/assets/icons/Common/close.svg'
import IconInfo from '~/assets/icons/Common/info.svg'
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import type { IProduct } from '~/types/products'
import { debounce, formatMoneyDecimal } from '~/utils/functions/common'

interface Props {
  show?: boolean
  product?: IProduct
}

const props = defineProps<Props>()
defineEmits(['close'])

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
  cartProducts.value.find((product) => product?.id === props.product?.id)
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
