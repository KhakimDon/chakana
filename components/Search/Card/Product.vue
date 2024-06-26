<template>
  <div class="flex-y-center gap-2 justify-between rounded-xl px-4 py-3">
    <div class="flex-y-center gap-2">
      <div
        class="border bg-white shrink-0 border-white-100 w-16 relative h-[52px] rounded-10 px-0.5"
      >
        <NuxtImg
          :src="product?.main_image"
          class="w-full h-auto absolute -bottom-1 object-contain object-center"
        />
      </div>
      <div class="space-y-0.5">
        <NuxtLinkLocale
          :to="`/product/${product?.id}`"
          class="font-semibold hover:text-orange md:text-[13px] md:leading-none text-[12px] line-clamp-3 max-w-[120px] md:max-w-full transition-300 text-dark"
          :class="titleClass"
          @click="saveSearchHistory"
        >
          {{ product?.name }}
        </NuxtLinkLocale>
        <p
          v-if="product?.product_uom_amount && product?.product_uom"
          class="mt-1.5 text-gray-100 font-medium text-xs leading-122"
        >
          {{ product?.product_uom_amount }} {{ $t(product?.product_uom) }}
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
          v-if="count < 1 || addingToCart"
          class="w-24"
          :text="$t('to_basket')"
          variant="outline"
          :disabled="addingToCart"
          :loading="addingToCart"
          @click="addToCartFirstTime(product)"
        />
        <MainCardCounter
          v-else
          v-model="count"
          :default-count="count"
          :max="product?.max_quantity ?? 100000"
          class="w-24 border-none bg-white-100"
          readonly
          @click="addToCart(product)"
        />
      </template>
      <p
        v-if="count > 0 || showCount"
        class="mt-1 text-xs font-medium text-dark leading-none"
        :class="{ '!text-red line-through': returned }"
      >
        {{
          formatMoneyDecimal(
            (showCount ? 1 : count) * product?.discount_price ?? 0,
            0
          )
        }}
        <span
          class="text-[10px] font-medium leading-130 text-dark"
          :class="{ '!text-red ': returned }"
          >UZS</span
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { useSearchStore } from '~/store/search.js'
import type { IProduct } from '~/types/products.js'
import { debounce, formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  product: IProduct
  titleClass?: string
  showCount?: boolean
  returned?: boolean
}

const props = defineProps<Props>()

const cartStore = useCartStore()
const orderCartStore = useCartOrderStore()
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

const route = useRoute()
const searchStore = useSearchStore()

const saveSearchHistory = () => {
  if (route.query.query) {
    searchStore.saveSearch(String(route.query.query))
  }
}
</script>
