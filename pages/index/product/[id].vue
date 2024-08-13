<template>
  <section class="mb-24 space-y-6">
    <div>
      <MainCardBadge
        v-if="data?.discount_percentage"
        class="px-1.5 py-1 mb-3 hidden md:flex"
        :percent="data?.discount_percentage"
        :type="data?.discount_type"
      />
      <div
        class="flex items-center gap-1 text-gray-100 cursor-pointer group md:hidden"
        @click="back"
      >
        <IconChevron
          class="cursor-pointer text-gray-100 group-hover:-translate-x-1 transition-300 group-hover:text-orange"
        />
        <p class="text-gray-100 group-hover:text-orange transition-300">
          {{ $t('back') }}
        </p>
      </div>
      <h1
        class="text-[22px] font-bold leading-130 text-dark mb-4 hidden md:block"
      >
        {{ data?.name }}
      </h1>
    </div>
    <div>
      <div class="grid grid-cols-1 md:grid-cols-9 gap-5 mt-4">
        <div
          class="max-w-[100%] md:max-w-[313px] shrink-0 col-span-12 md:col-span-4"
        >
          <div
            class="flex-center bg-white-100 rounded-2xl w-full min-h-[313px] p-3 mb-4"
          >
            <swiper
              v-if="data?.extra_images?.length || data?.main_image"
              :modules="[Thumbs, Navigation]"
              :thumbs="{ swiper: thumbsSwiper }"
              class="mb-3 md:mb-5 w-full"
              :slides-per-view="'auto'"
            >
              <swiper-slide v-for="(item, index) in images" :key="index">
                <div
                  class="flex-center bg-white-100 rounded-2xl w-full min-h-[313px] p-3 mb-4"
                >
                  <NuxtImg
                    :src="item?.image"
                    alt="card-image"
                    class="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <swiper
            v-bind="thumbSettings"
            class="w-full"
            :slides-per-view="'auto'"
            :space-between="6"
            @swiper="setThumbsSwiper"
            @slide-change="onChange"
          >
            <swiper-slide
              v-for="(item, index) in data?.extra_images"
              :key="index"
              class="h-full border-2 border-transparent !w-12"
            >
              <div
                class="relative bg-white-100 overflow-hidden rounded-10 w-11 h-11 cursor-pointer"
              >
                <NuxtImg
                  :src="item?.image"
                  alt="card-image"
                  class="w-11 h-11 object-contain"
                  loading="lazy"
                />
              </div>
            </swiper-slide>
            <span
              class="thumb-gradient –left-4 md:left-0"
              :class="{ 'pointer-events-none opacity-0': isBeginning }"
            />
            <span
              class="thumb-gradient reverse right-0"
              :class="{ 'pointer-events-none opacity-0': isEnd }"
            />
          </swiper>
        </div>
        <div class="col-span-12 md:col-span-5">
          <MainCardBadge
            v-if="data?.discount_percentage"
            class="px-1.5 py-1 mb-3 flex md:hidden"
            :percent="data?.discount_percentage"
            :type="data?.discount_type"
          />
          <h1
            class="text-[22px] font-bold leading-130 text-dark mb-4 block md:hidden"
          >
            {{ data?.name }}
          </h1>
          <p
            v-if="data?.product_uom_amount && data?.product_uom"
            class="text-base font-medium text-gray-100 hidden md:flex"
          >
            {{ data?.product_uom_amount }} {{ $t(data?.product_uom) }}
          </p>
          <div v-if="data?.discount_price">
            <div class="flex items-center gap-1">
              <p
                class="text-xs leading-[12px] font-medium text-gray-100 line-through"
              >
                {{ formatMoneyDecimal(data?.price) }}
                <span class="text-[11px] font-[150%]">UZS</span>
              </p>
              <p
                v-if="data?.discount_percentage"
                class="text-dark leading-120 font-medium text-xs bg-[#FFE81B] rounded px-1"
              >
                {{ data?.discount_percentage }}%
              </p>
            </div>
            <p
              class="mt-2 leading-122 font-bold text-green text-[28px]"
              :class="{ '!text-red !mt-0': data?.discount_price }"
            >
              {{ formatMoneyDecimal(data?.discount_price ?? data?.price) }}
              <span class="text-[22px] font-[150%]">UZS</span>
            </p>
          </div>
          <p v-else class="text-[28px] font-bold leading-122 text-dark">
            {{ formatMoneyDecimal(data?.price) }}
            <span class="text-[22px] leading-130 font-semibold">UZS</span>
          </p>

          <div class="flex-y-center gap-2">
            <div class="w-full flex-y-center gap-2 mt-4">
              <BaseButton
                v-if="count < 1 || addingToCart"
                class="w-full"
                :text="
                  data?.max_quantity > 0 ? $t('to_basket') : $t('out_of_stock')
                "
                variant="secondary"
                :disabled="addingToCart || data?.max_quantity <= 0"
                :loading="addingToCart"
                @click="addToCartFirstTime(data)"
              >
                <template #prefix>
                  <IconCart />
                </template>
              </BaseButton>
              <MainCardCounter
                v-else
                v-model="count"
                :default-count="count"
                :max="data?.max_quantity ?? 100000"
                readonly
                @click="addToCart(data)"
              />

              <BaseButton
                variant="outline"
                class="hover:!bg-transparent hover:!text-dark hover:!border-orange !py-2"
                @click="show = true"
              >
                <IconExport class="text-xl" />
              </BaseButton>
              <BaseButton
                v-if="data.saved || saved"
                variant="outline"
                class="hover:!bg-transparent hover:!text-dark hover:!border-orange !py-2"
                :loading="buttonLoading"
                @click="savedProducts"
              >
                <IconHeart class="text-xl text-orange" />
                <p class="hidden md:block">{{ $t('saved_product') }}</p>
              </BaseButton>
              <BaseButton
                v-else
                variant="outline"
                class="hover:!bg-transparent hover:!text-dark hover:!border-orange !py-2"
                :loading="buttonLoading"
                @click="savedProducts"
              >
                <IconHeartPlus class="text-xl" />
              </BaseButton>
            </div>
          </div>

          <div>
            <ProductVariants
              v-if="data?.product_variants?.length"
              :variants="data?.product_variants"
              :name="data?.name"
            />
          </div>

          <div
            v-if="data?.description"
            class="h-px w-full bg-white-100 mt-5 mb-4"
          />

          <div v-if="data?.description">
            <h4 class="text-lg !leading-normal font-bold text-dark">
              {{ $t('description') }}
            </h4>

            <div class="flex items-end">
              <div
                ref="description"
                :class="open ? 'line-clamp-none' : 'line-clamp-2'"
                class="text-gray-100 leading-140 text-sm mt-2 max-w-[380px] transition-300"
                v-html="data?.description"
              />
              <IconChevron
                v-if="shouldShowArrow"
                :class="[open ? 'rotate-90' : '']"
                class="text-orange -rotate-90 cursor-pointer"
                @click="openDesc"
              />
            </div>
          </div>

          <div
            v-if="data?.specifications?.length"
            class="h-px w-full bg-white-100 my-4"
          />

          <div v-if="data?.specifications?.length">
            <h4 class="text-lg !leading-normal font-bold text-dark">
              {{ $t('about_product') }}
            </h4>

            <ProductSpecifications :list="data?.specifications" class="mt-2" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <h5 class="text-xl leading-normal font-bold text-dark mb-5">
        {{ $t('recommended_products') }}
      </h5>
      <Transition name="fade" mode="out-in">
        <div v-if="loading?.list" class="grid grid-cols-5 gap-4">
          <MainCardLoading v-for="key in 16" :key="key" />
        </div>
        <div
          v-else-if="list?.length"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8"
        >
          <MainCard v-for="(card, index) in list" :key="index" :card="card" />
          <!--            @open="selectProduct(card)"-->
        </div>
        <div v-else>
          <CommonNoData class="col-span-4" />
        </div>
      </Transition>
      <div
        v-if="loading?.button"
        class="grid md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <MainCardLoading v-for="key in 12" :key="key" />
      </div>
      <div
        v-if="
          !loading?.list &&
          !loading?.button &&
          paginationData?.count > list?.length
        "
        ref="infiniteScrollTrigger"
      />
    </div>
    <BaseModal v-model="show" :title="$t('share')">
      <div
        class="rounded-xl border border-white-100 flex items-center justify-between p-4"
      >
        <div
          v-for="item in shareData"
          :key="item.id"
          class="border border-white-100 p-1.5 rounded-xl cursor-pointer"
          @click="share(item.title, data?.name)"
        >
          <img :src="item.image" alt="" class="p-1.5 bg-orange/10 rounded-lg" />
        </div>
        <div
          class="border border-white-100 p-1.5 rounded-xl cursor-pointer relative"
          @click="copyUrl"
        >
          <img
            src="/images/fake/copy-link.svg"
            alt=""
            class="p-1.5 bg-orange/10 rounded-lg"
          />
          <CommonTooltip with-trigger :show="copied"
            >{{ $t('copied') }}
          </CommonTooltip>
        </div>
      </div>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import IconCart from '~/assets/icons/Common/cart.svg'
import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconExport from '~/assets/icons/Common/export.svg'
import IconHeart from '~/assets/icons/Common/heart.svg'
import IconHeartPlus from '~/assets/icons/Common/heart-plus.svg'
import { shareData } from '~/data'
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import {
  debounce,
  formatMoneyDecimal,
  getImageSize,
  share,
} from '~/utils/functions/common'

const open = ref(false)
const show = ref(false)
const saved = ref(false)
const route = useRoute()
const buttonLoading = ref(false)
const { handleError } = useErrorHandling()
const openDesc = () => {
  open.value = !open.value
}

const { list, loading, paginationData, loadMore } = useListFetcher(
  `alternative/products/?product_id=${route.params.id}`,
  25,
  true
)

const router = useRouter()

const copied = ref(false)

async function copyUrl() {
  copied.value = true
  await navigator.clipboard.writeText(window.location.href)
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

const thumbSettings = {
  slidesPerView: 'auto',
  spaceBetween: 6,
  watchSlidesProgress: true,
  modules: [Thumbs, Navigation],
}
const thumbsSwiper = ref(null)
const setThumbsSwiper = (swiper: SwiperClass) => {
  thumbsSwiper.value = swiper
}

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

const isBeginning = ref(true)
const isEnd = ref(false)
const onChange = (e: SwiperClass) => {
  isBeginning.value = e.isBeginning
  isEnd.value = e.isEnd
  if (e.visibleSlidesIndexes.includes(0)) {
    isBeginning.value = true
  }
  if (e.visibleSlidesIndexes.includes(e.slides.length - 1)) {
    isEnd.value = true
  }
}
const savedProducts = () => {
  buttonLoading.value = true
  useApi()
    .$post('/saved/products', {
      body: {
        product_id: route.params.id,
      },
    })
    .then((res: any) => {
      if (res.saved) {
        saved.value = res.saved
      } else {
        saved.value = false
      }
    })
    .catch((err) => {
      handleError(err)
    })
    .finally(() => (buttonLoading.value = false))
}

const { data, error } = (await useAsyncData('product', async () => {
  return await useApi().$get(`/product/${route?.params.id}`)
})) as any

const images = computed(() => {
  return data?.value?.extra_images?.length > 0
    ? data?.value?.extra_images
    : [
        {
          image: getImageSize(data?.value, data?.value?.main_image, 'large'),
          video_url: null,
        },
      ]
})

if (error.value) {
  showError({
    statusCode: 404,
  })
}

const infiniteScrollTrigger = ref<HTMLElement | null>(null)

useIntersectionObserver(infiniteScrollTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting && !loading.list) {
    loadMore()
  }
})

const cartProduct = computed(() =>
  cartProducts.value.find((product) => product?.id === data.value?.id)
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

useSeoMeta({
  title: data.value?.name,
  description: data.value?.description,
  ogTitle: data.value?.name,
  twitterTitle: data.value?.name,
  twitterCard: 'summary',
  twitterSite: '@xolodilnik',
  ogImage: data.value?.main_image,
  twitterImage: data.value?.main_image,
})

const description = ref<HTMLElement | null>(null)
const shouldShowArrow = computed(() => {
  if (description.value) {
    const lineHeight = parseFloat(
      getComputedStyle(description.value).lineHeight
    )
    const maxHeight = lineHeight * 2 // for line-clamp-2
    return description.value.scrollHeight > maxHeight
  }
  return false
})

onMounted(() => {
  // Trigger the computation once the component is mounted
  shouldShowArrow.value
})

const localePath = useLocalePath()

const back = () => {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push(localePath('/'))
  }
}
</script>

<style scoped>
.swiper-slide-thumb-active {
  border: 2px solid #ff831b !important;
  border-radius: 10px !important;
  opacity: 100%;
}

.thumb-gradient {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 86px;
  height: 100%;
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
  z-index: 2;
  transition: all 0.3s;
  right: auto;
}

.thumb-gradient.reverse {
  transform: rotateY(180deg);
  left: auto;
  right: 0;
}
@media screen and (max-width: 640px) {
  .thumb-gradient {
    left: -16px;
    right: auto;
  }
  .thumb-gradient.reverse {
    left: auto;
    right: -16px;
  }
}
</style>
