<template>
  <div class="flex-y-center gap-2 justify-between rounded-xl px-4 py-3">
    <div class="flex-y-center gap-2">
      <div
        class="border bg-white shrink-0 border-white-100 w-16 relative h-[52px] rounded-10 px-0.5"
      >
        <NuxtImg
          :src="product?.main_image"
          class="w-full h-fit absolute -bottom-1 object-cover object-center"
        />
      </div>
      <div class="space-y-0.5">
        <NuxtLinkLocale
          :to="`/project/${product?.id}`"
          class="text-[13px] font-semibold hover:text-orange transition-300 leading-none text-dark"
          :class="titleClass"
        >
          {{ product?.name }}
        </NuxtLinkLocale>
        <p class="text-xs font-medium leading-130 text-gray-400">
          {{ product?.weight }} {{ product?.weight_measure }}
        </p>
      </div>
    </div>
    <div class="w-24 shrink-0 text-right">
      <template v-if="showCount">
        <i18n-t
          keypath="count"
          tag="p"
          class="w-[92px] text-center py-1 text-sm font-normal leading-122 text-dark rounded-lg bg-white-100"
        >
          <template #count>
            <span class="font-bold">
              {{ formatMoneyDecimal(product?.quantity) }}
            </span>
          </template>
        </i18n-t>
      </template>
      <template v-else>
        <BaseButton
          v-if="count < 1"
          class="w-24"
          :text="$t('to_basket')"
          variant="outline"
          @click="addToCart(product)"
        />
        <MainCardCounter
          v-else
          v-model="count"
          :default-count="count"
          :max="product?.max_quantity ?? 100000"
          class="w-24 border-none bg-white-100"
          readonly
        />
      </template>
      <p
        v-if="count > 0 || showCount"
        class="mt-1 text-xs font-medium text-dark leading-none"
      >
        {{
          formatMoneyDecimal((showCount ? 1 : count) * product?.price ?? 0, 0)
        }}
        <span class="text-[10px] font-medium leading-130 text-dark">UZS</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'
import type { IProduct } from '~/types/products.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  product: IProduct
  titleClass?: string
  showCount?: boolean
}

const props = defineProps<Props>()

const cartStore = useCartStore()
const count = ref(0)

const cartProducts = computed(() => cartStore.products)
const addToCart = (product: any) => {
  if (count.value <= product?.max_quantity) {
    count.value++
    cartStore.addToCart({
      ...product,
      cart_count: count.value,
    })
  }
}

watch(
  () => count.value,
  (newValue) => {
    if (newValue === 0) {
      cartStore.removeFromCart(props.product?.id)
    } else {
      cartStore.updateToCart({
        ...props.product,
        cart_count: newValue,
      })
    }
  }
)

const cartProduct = computed(() =>
  cartProducts.value.find((product) => product?.id === props.product?.id)
)

watch(
  cartProduct,
  (newValue) => {
    if (newValue) {
      count.value = newValue.cart_count
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
    count.value = cartProduct.value?.cart_count ?? 0
  }
})
</script>
