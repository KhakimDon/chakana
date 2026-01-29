<template>
  <div
    class="flex flex-col bg-[#F3F3F3] max-w-[150px] min-w-[149px] rounded-[15px] justify-between gap-5 cursor-pointer"
  >
    <div @click.stop="handleCardClick">
      <div class="relative m-[2.94px]">
        <div
          :class="[
            'rounded-10 imggradient bg-[#FFFFFF] flex-center relative',
            hasMultipleImages ? 'h-[113px] pb-3 overflow-visible' : 'h-[113px] overflow-hidden'
          ]"
        >
          <MainCardBadge
            v-if="card?.discount_type === 'percentage'"
            :percent="card?.discount_percentage ?? undefined"
            :type="card?.discount_type"
            class="absolute bottom-1.5 left-2 z-10"
          />

          <!-- Swiper for multiple images -->
          <Swiper
            v-if="hasMultipleImages"
            :modules="[]"
            :slides-per-view="1"
            class="w-full h-full card-swiper"
            @swiper="onSwiperInit"
            @slide-change="onSlideChange"
          >
            <SwiperSlide
              v-for="(img, index) in productImages"
              :key="index"
              class="flex-center"
            >
              <nuxt-img
                :src="getImageUrl(img)"
                alt="card-image"
                :class="[
                  'w-[135px] h-full object-contain',
                  { 'w-[72px] h-[72px]': isFallbackImage(img) },
                ]"
                loading="lazy"
                @error="(e) => onImgError(e, img)"
              />
            </SwiperSlide>
          </Swiper>
          
          <!-- Single image fallback -->
          <nuxt-img
            v-else
            :src="imageSrc"
            alt="card-image"
            :class="[
              'w-[135px] h-full object-contain',
              { 'w-[72px] h-[72px]': isFallback },
            ]"
            loading="lazy"
            @error="onImgError"
          />
        </div>
        <!-- Custom Pagination -->
        <div
          v-if="hasMultipleImages"
          class="flex items-center justify-center gap-[3px] mt-[4.4px]"
        >
          <button
            v-for="(img, index) in productImages"
            :key="index"
            :class="[
              'w-[4.5px] h-[4.5px] rounded-full transition-all duration-300',
              activeSlideIndex === index ? 'bg-[#9A9A9A]' : 'bg-[#DBDBDB]'
            ]"
            @click.stop="goToSlide(index)"
          />
        </div>
      </div>
      <div class=" px-[8.81px]">
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
          :class="{ '!text-red !mt-0': card?.discount_price }"
          class="mt-2 text-[12px] line leading-122 font-[1000] text-green"
        >
          {{ formatMoneyDecimal(card?.discount_price ?? card?.price) }}
          <span class="text-[11px] font-[150%]">UZS</span>
        </p>
        <p
          class="mt-[2px] text-[14px] leading-122 text-[#101010] font-medium line-clamp-1 hover:text-orange transition-300"
        >
          {{ card?.name }}
        </p>
        <p
          v-if="card?.product_uom_amount && card?.product_uom"
          class="mt-1.5 text-[#101010] font-medium text-[12px] leading-122"
        >
          {{ card?.product_uom_amount }} {{ $t(card?.product_uom) }}
        </p>
      </div>
    </div>
    <ClientOnly>
      <BaseButton
        v-if="count < 1 || addingToCart"
        :disabled="addingToCart || card?.max_quantity <= 0"
        :loading="addingToCart"
        :text="card?.max_quantity > 0 ? $t('to_basket') : $t('out_of_stock')"
        class="w-full !py-2"
        variant="outline"
        @click.stop="addToCartFirstTime(card)"
      />
      <MainCardCounter
        v-else
        v-model="count"
        :default-count="count"
        :max="card?.max_quantity ?? 100000"
        readonly
        @click.stop
        @change="addToCart(card)"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { useAuthStore } from '~/store/auth.js'
import { useProductStore } from '~/store/product'
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
const emit = defineEmits(['open'])

const router = useRouter()
const localePath = useLocalePath()
const authStore = useAuthStore()
const productStore = useProductStore()

const handleCardClick = () => {
  // Check if user is authorized
  if (!authStore.isAuthorized) {
    // Open auth modal
    authStore.showAuth = true
    return
  }
  
  // Save product data to store for detail page
  productStore.setCurrentProduct(props.card)
  
  // If authorized, navigate to product page
  router.push(localePath(`/product/${props.card?.id}`))
  emit('open')
}

const fallbackIcon = '/images/svg/cart.svg'

// Get all product images
const productImages = computed(() => {
  const images: string[] = []
  const card = props.card as any
  
  // Priority 1: Check for extra_images (from API mapping) - array of objects with image property
  if (card?.extra_images && Array.isArray(card.extra_images) && card.extra_images.length > 0) {
    const extraImgs = card.extra_images.map((img: any) => {
      if (typeof img === 'string') return img
      return img?.image || img?.image_1024 || img?.image_512 || img?.image_256 || ''
    }).filter((url: string) => url && url !== '')
    if (extraImgs.length > 0) {
      return extraImgs
    }
  }
  
  // Priority 2: Check for product_images (from API response) - array of image objects
  if (card?.product_images && Array.isArray(card.product_images) && card.product_images.length > 0) {
    const prodImgs = card.product_images.map((img: any) => {
      // Handle string directly
      if (typeof img === 'string') return img
      // Handle object with image properties
      return img?.image || img?.image_1024 || img?.image_512 || img?.image_256 || ''
    }).filter((url: string) => url && url !== '')
    if (prodImgs.length > 0) {
      return prodImgs
    }
  }
  
  // Priority 3: Fallback to main_image
  if (props.card?.main_image) {
    images.push(props.card.main_image)
  }
  
  return images.length > 0 ? images : [fallbackIcon]
})

const hasMultipleImages = computed(() => {
  const count = productImages.value.length
  return count > 1
})

const imageSrc = ref<string>(fallbackIcon)
const isFallback = computed(() => imageSrc.value === fallbackIcon)

watchEffect(() => {
  // prefer sized image, but fallback to default icon
  const candidate =
    getImageSize(props.card, props.card?.main_image, 'small') || ''
  imageSrc.value = candidate || fallbackIcon
})

const getImageUrl = (img: string) => {
  if (!img || img === fallbackIcon) return fallbackIcon
  return getImageSize(props.card, img, 'small') || img || fallbackIcon
}

const isFallbackImage = (img: string) => {
  return !img || img === fallbackIcon || getImageUrl(img) === fallbackIcon
}

const onImgError = (event?: any, img?: string) => {
  // For single image
  if (!img && imageSrc.value !== fallbackIcon) {
    imageSrc.value = fallbackIcon
  }
  // For swiper images, error is handled by fallback
}

// Swiper controls
const swiperInstance = ref<any>(null)
const activeSlideIndex = ref(0)

const onSlideChange = (swiper: any) => {
  activeSlideIndex.value = swiper.activeIndex
}

const goToSlide = (index: number) => {
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(index)
    activeSlideIndex.value = index
  }
}

const onSwiperInit = (swiper: any) => {
  swiperInstance.value = swiper
}

const orderCartStore = useCartOrderStore()
const cartStore = useCartStore()
const count = ref(0)

const addingToCart = ref(false)

const cartProducts = computed(() => cartStore.products)
const addToCart = (product: IProduct) => {
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

const addToCartFirstTime = (product: IProduct) => {
  count.value++
  addToCart(product)
}

const cartProduct = computed<IProduct | undefined>(() =>
  cartProducts.value.find((product: IProduct) => product?.id === props.card?.id)
)

watch(
  cartProduct,
  (newValue: IProduct | undefined) => {
    if (newValue) {
      count.value = newValue?.quantity
    }
  },
  { deep: true, immediate: true }
)

watch(
  cartProducts,
  (newValue: IProduct[]) => {
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

<style>
.imggradient{
  box-shadow: 0 2px 3px #F3F3F3;
}

/* Swiper Styles */
:deep(.card-swiper) {
  position: relative;
}
</style>
