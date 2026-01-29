<template>
  <!-- Loading Shimmer -->
  <ProductLoading v-if="productLoading && !data" />
  
  <!-- Product Content -->
  <section v-else class="mb-24 md:space-y-0 space-y-6">
    <!-- Mobile Back Button -->
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

    <!-- TOP PRODUCT Badge (Desktop) -->
    <div v-if="data?.is_top" class="hidden md:block !mt-0">
      <span
        class="inline-flex items-center gap-1.5 bg-[#C9F4B8] text-[#2D8A0F] text-xs font-bold px-3 py-1.5 rounded-full"
      >
        <span class="text-sm">🔥</span>
        {{ $t('top_product') || 'ТОП ПРОДУКТ' }}
      </span>
    </div>

    <!-- Product Title (Desktop) -->
    <div class="hidden md:block">
      <h1 class="text-[22px] font-bold mt-3 leading-130 text-dark">
        {{ data?.name }}
      </h1>
      <p
        v-if="data?.subtitle || data?.product_uom"
        class="text-sm text-gray-100 mt-1"
      >
        {{
          data?.subtitle ||
          (data?.product_uom_amount
            ? `${data.product_uom_amount} ${data.product_uom}`
            : '')
        }}
      </p>
    </div>

    <div>
      <div class="grid grid-cols-1 md:grid-cols-9 gap-6 mt-4">
        <!-- Left Column: Product Images -->
        <div class="col-span-12 md:col-span-4">
          <!-- Main Image -->
          <div
            class="bg-white rounded-2xl w-full min-h-[280px] md:min-h-[320px] p-4 flex-center border border-gray-100/20"
          >
            <swiper
              v-if="data?.extra_images?.length || data?.main_image"
              :modules="[Thumbs, Navigation]"
              :thumbs="{ swiper: thumbsSwiper }"
              class="w-full"
              :slides-per-view="1"
              :initial-slide="activeThumbIndex"
              @swiper="onMainSwiperInit"
              @slide-change="onMainSwiperChange"
            >
              <swiper-slide v-for="(item, index) in images" :key="index">
                <div class="flex-center w-full min-h-[240px] md:min-h-[280px]">
                  <NuxtImg
                    :src="BASE_URL+item?.image"
                    :alt="data?.name"
                    class="max-w-full max-h-[260px] md:max-h-[300px] object-contain"
                    loading="lazy"
                  />
                </div>
              </swiper-slide>
            </swiper>
          </div>

          <!-- Thumbnail Gallery -->
          <div v-if="images?.length > 1" class="flex gap-2 mt-3">
            <button
              v-for="(item, index) in images"
              :key="index"
              class="w-11 h-11 rounded-lg bg-white border-2 transition-300 flex-center overflow-hidden"
              :class="activeThumbIndex === index ? 'border-[#ED2024]' : 'border-gray-200 hover:border-gray-300'"
              @click="goToSlide(index)"
            >
              <NuxtImg
                :src="BASE_URL+item?.image"
                :alt="`${data?.name} ${index + 1}`"
                class="w-9 h-9 object-contain"
                loading="lazy"
              />
            </button>
          </div>
        </div>

        <!-- Right Column: Product Info -->
        <div class="col-span-12 md:col-span-5">
          <!-- TOP PRODUCT Badge (Mobile) -->
          <div v-if="data?.is_top" class="md:hidden mb-3">
            <span
              class="inline-flex items-center gap-1.5 bg-[#C9F4B8] text-[#2D8A0F] text-xs font-bold px-3 py-1.5 rounded-full"
            >
              <span class="text-base">🔥</span>
              ТОП ПРОДУКТ
            </span>
          </div>

          <!-- Product Title (Mobile) -->
          <h1 class="text-xl font-bold leading-130 text-dark mb-1 md:hidden">
            {{ data?.name }}
          </h1>
          <p
            v-if="data?.subtitle || data?.product_uom"
            class="text-sm text-gray-100 mb-3 md:hidden"
          >
            {{
              data?.subtitle ||
              (data?.product_uom_amount
                ? `${data.product_uom_amount} ${data.product_uom}`
                : '')
            }}
          </p>

          <!-- Price Section -->
          <div class="mb-4 md:mb-5">
            <div v-if="data?.discount_price" class="space-y-1">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium text-gray-100 line-through">
                  {{ formatMoneyDecimal(data?.price) }} UZS
                </p>
                <span
                  v-if="data?.discount_percentage"
                  class="text-dark font-bold text-xs bg-[#FFE81B] rounded px-1.5 py-0.5 -rotate-2"
                >
                  -{{ data?.discount_percentage }}%
                </span>
              </div>
              <p class="text-[28px] md:text-[32px] font-bold leading-tight text-[#4DB839]">
                {{ formatMoneyDecimal(data?.discount_price) }}
                <span class="text-[20px] md:text-[24px] font-semibold">UZS</span>
              </p>
            </div>
            <p
              v-else
              class="text-[28px] md:text-[32px] font-bold leading-tight text-[#4DB839]"
            >
              {{ formatMoneyDecimal(data?.price) }}
              <span class="text-[20px] md:text-[24px] font-semibold">UZS</span>
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2 md:gap-3 mb-6">
            <!-- Cart Button (when not in cart) -->
            <BaseButton
              v-if="count < 1 || addingToCart"
              class="!h-11 !px-6"
              :text="
                data?.max_quantity > 0 ? $t('to_basket') : $t('out_of_stock')
              "
              variant="secondary"
              :disabled="addingToCart || data?.max_quantity <= 0"
              :loading="addingToCart"
              @click="addToCartFirstTime(data)"
            >
              <template #prefix>
                <IconCart class="text-lg" />
              </template>
            </BaseButton>
            
            <!-- Counter (when product in cart) -->
            <div
              v-else
              class="flex items-center gap-0 bg-[#2D8A0F] rounded-xl overflow-hidden h-11"
            >
              <button
                class="h-full px-3 flex-center hover:bg-black/10 transition-300"
                @click="removeFromCart"
              >
                <IconTrash class="text-white text-lg" />
              </button>
              <span class="text-white font-semibold text-sm px-2 min-w-[50px] text-center">
                {{ count }} {{ $t('pcs') || 'шт.' }}
              </span>
              <button
                class="h-full px-3 flex-center hover:bg-black/10 transition-300"
                :disabled="count >= (data?.max_quantity ?? 100000)"
                @click="incrementCount"
              >
                <IconPlus class="text-white text-lg" />
              </button>
            </div>

            <!-- Share Button -->
            <button
              class="h-11 flex-center gap-2 rounded-xl border border-gray-200 hover:border-orange transition-300"
              :class="count >= 1 ? 'px-4' : 'w-11'"
              @click="show = true"
            >
              <IconExport class="text-lg text-dark" />
              <span 
                v-if="count >= 1" 
                class="text-sm text-dark font-medium hidden sm:inline"
              >
                {{ $t('share') || 'Поделиться' }}
              </span>
            </button>

            <!-- Save Button -->
            <button
              class="h-11 flex-center gap-2 rounded-xl border border-gray-200 hover:border-orange transition-300 relative"
              :class="[
                count >= 1 ? 'px-4' : 'w-11',
                { '!border-[#ED2024] bg-[#ED2024]/5': data?.saved || saved }
              ]"
              :disabled="buttonLoading"
              @click="savedProducts"
            >
              <!-- Loading Spinner -->
              <div
                v-if="buttonLoading"
                class="absolute inset-0 flex-center z-10"
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
                    fill="#ED2024"
                  />
                </svg>
              </div>
              
              <!-- Button Content -->
              <div :class="{ 'opacity-0': buttonLoading }" class="flex-center gap-2">
                <IconHeart
                  v-if="data?.saved || saved"
                  class="text-lg text-[#ED2024]"
                />
                <IconHeartPlus v-else class="text-lg text-dark" />
                <span
                  v-if="count >= 1"
                  class="text-sm font-medium hidden sm:inline"
                  :class="data?.saved || saved ? 'text-[#ED2024]' : 'text-dark'"
                >
                  {{ data?.saved || saved ? ($t('saved') || 'Сохранён') : ($t('save') || 'Сохранить') }}
                </span>
              </div>
            </button>
          </div>

          <!-- Product Variants -->
          <div v-if="data?.product_variants?.length" class="mb-6">
            <h4 class="text-sm font-bold text-dark mb-3">
              {{ $t('other_variants') || 'Другие варианты' }}
            </h4>
            <ProductVariants
              :variants="data?.product_variants"
              :name="data?.name"
            />
          </div>

          <!-- Description Section -->
          <div v-if="data?.description" class="mb-6">
            <div class="h-px w-full bg-gray-200 mb-4" />
            <h4 class="text-base font-bold text-dark mb-2">
              {{ $t('description') || 'Описание' }}
            </h4>
            <div class="relative">
              <div
                ref="descriptionRef"
                :class="open ? '' : 'line-clamp-3'"
                class="text-gray-100 leading-relaxed text-sm transition-300"
                v-html="data?.description"
              />
              <button
                v-if="shouldShowArrow || open"
                class="inline-flex items-center text-[#ED2024] text-sm font-medium mt-1 hover:underline"
                @click="openDesc"
              >
                <IconChevron
                  :class="open ? 'rotate-90' : '-rotate-90'"
                  class="text-[#ED2024] transition-300"
                />
              </button>
            </div>
          </div>

          <!-- Specifications Section -->
          <div v-if="data?.specifications?.length">
            <div class="h-px w-full bg-gray-200 mb-4" />
            <h4 class="text-lg font-bold text-dark mb-3">
              {{ $t('about_product') || 'О товаре' }}
            </h4>
            <ProductSpecifications :list="data?.specifications" />
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products Section -->
    <div class="!mt-8 md:mt-12">
      <h2 class="text-lg md:text-xl font-bold text-dark mb-4 md:mb-6">
        {{ $t('similar_products') || 'Похожие товары' }}
      </h2>
      <Transition name="fade" mode="out-in">
        <div
          v-if="loading?.list"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <MainCardLoading v-for="key in 8" :key="key" />
        </div>
        <div
          v-else-if="list?.length"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <MainCard v-for="(card, index) in list" :key="index" :card="card" />
        </div>
        <div v-else>
          <CommonNoData class="col-span-4" />
        </div>
      </Transition>
      <div
        v-if="loading?.button"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4"
      >
        <MainCardLoading v-for="key in 8" :key="key" />
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
    <BaseModal v-model="show" :title="$t('share') || 'Поделиться'">
      <div class="flex items-center justify-center gap-4 py-2">
        <!-- Twitter/X -->
        <button
          class="w-12 h-12 rounded-xl border border-gray-200 flex-center hover:border-dark hover:bg-gray-50 transition-300"
          @click="shareToTwitter"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>
        
        <!-- Telegram -->
        <button
          class="w-12 h-12 rounded-xl border border-gray-200 flex-center hover:border-[#0088cc] hover:bg-[#0088cc]/5 transition-300"
          @click="shareToTelegram"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0088cc">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </button>
        
        <!-- Facebook -->
        <button
          class="w-12 h-12 rounded-xl border border-gray-200 flex-center hover:border-[#1877f2] hover:bg-[#1877f2]/5 transition-300"
          @click="shareToFacebook"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>
        
        <!-- WhatsApp -->
        <button
          class="w-12 h-12 rounded-xl border border-gray-200 flex-center hover:border-[#25d366] hover:bg-[#25d366]/5 transition-300"
          @click="shareToWhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
        
        <!-- Copy Link -->
        <button
          class="w-12 h-12 rounded-xl border border-gray-200 flex-center hover:border-orange hover:bg-orange/5 transition-300 relative"
          @click="copyUrl"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <CommonTooltip with-trigger :show="copied">
            {{ $t('copied') || 'Скопировано' }}
          </CommonTooltip>
        </button>
      </div>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { convert } from 'html-to-text'
import { Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { onBeforeRouteLeave } from 'vue-router'

import IconCart from '~/assets/icons/Common/cart.svg'
import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconExport from '~/assets/icons/Common/export.svg'
import IconHeart from '~/assets/icons/Common/heart.svg'
import IconHeartPlus from '~/assets/icons/Common/heart-plus.svg'
import IconTrash from '~/assets/icons/Common/trash.svg'
import IconPlus from '~/assets/icons/Common/plus.svg'
import { useAuthStore } from '~/store/auth'
import { useCartStore } from '~/store/cart.js'
import { useCartOrderStore } from '~/store/cart_order.js'
import { useProductStore } from '~/store/product'
import { useSavedStore } from '~/store/saved'
import { useStorePageStore } from '~/store/storePage'
import { useCustomToast } from '~/composables/useCustomToast'
import { useErrorHandling } from '~/composables/useErrorHandling'
import {
  debounce,
  formatMoneyDecimal,
  getImageSize,
} from '~/utils/functions/common'

function htmlToText(html: string) {
  return convert(html, {
    wordwrap: false, // Prevents wrapping text
    ignoreHref: true, // Ignores links in the text
    ignoreImage: true, // Ignores images in the text
  })
}

const open = ref(false)
const show = ref(false)
const saved = ref(false)
const route = useRoute()
const buttonLoading = ref(false)
const { handleError } = useErrorHandling()
const { showToast } = useCustomToast()
const { t } = useI18n()
const openDesc = () => {
  open.value = !open.value
}

// Related products state
const relatedProducts = ref<any[]>([])
const relatedLoading = ref(false)

// Simulated loading/pagination for compatibility
const loading = reactive({ list: false, button: false })
const paginationData = ref({ count: 0 })
const list = computed(() => relatedProducts.value)
const base = computed(() => import.meta.env.BASE_URL || '')

const loadMore = () => {
  // Pagination not needed for now
}

const BASE_URL = import.meta.env.VITE_BASE_URL


const router = useRouter()

const copied = ref(false)

async function copyUrl() {
  copied.value = true
  await navigator.clipboard.writeText(window.location.href)
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

const shareToTwitter = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(data.value?.name || '')
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}

const shareToTelegram = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(data.value?.name || '')
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
}

const shareToFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

const shareToWhatsApp = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(data.value?.name || '')
  window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
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
// const useEnv =  computed(() =>)

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

const incrementCount = () => {
  if (count.value < (data.value?.max_quantity ?? 100000)) {
    count.value++
    addToCart(data.value)
  }
}

const removeFromCart = () => {
  if (count.value > 0) {
    count.value--
    addToCart(data.value)
  }
}

const isBeginning = ref(true)
const isEnd = ref(false)
const activeThumbIndex = ref(0)

const mainSwiperRef = ref<any>(null)

const onChange = (e: SwiperClass) => {
  isBeginning.value = e.isBeginning
  isEnd.value = e.isEnd
  activeThumbIndex.value = e.activeIndex
  if (e.visibleSlidesIndexes.includes(0)) {
    isBeginning.value = true
  }
  if (e.visibleSlidesIndexes.includes(e.slides.length - 1)) {
    isEnd.value = true
  }
}

const onMainSwiperChange = (swiper: any) => {
  activeThumbIndex.value = swiper.activeIndex
}

const onMainSwiperInit = (swiper: any) => {
  mainSwiperRef.value = swiper
}

const goToSlide = (index: number) => {
  activeThumbIndex.value = index
  if (mainSwiperRef.value) {
    mainSwiperRef.value.slideTo(index)
  }
}
const savedStore = useSavedStore()
const authStore = useAuthStore()

const savedProducts = async () => {
  if (!data.value?.id) return
  
  // Check if user is authenticated
  if (!authStore.isAuthorized) {
    authStore.showAuth = true
    return
  }
  
  buttonLoading.value = true
  try {
    // Pass current saved state to ensure correct API call
    const result = await savedStore.toggleSaved(data.value.id, saved.value)
    
    // $delete and $post now handle 204 correctly, so result.success should always be true for success
    if (result.success) {
      // Update local state
      saved.value = result.isSaved
      
      // Update local product data
      if (data.value) {
        data.value.saved = result.isSaved
      }
      
      // Show success toast
      if (result.isSaved) {
        showToast(t('product_added_to_saved'), 'success')
      } else {
        showToast(t('product_removed_from_saved'), 'success')
      }
    } else {
      // result.success is false - this should not happen for 204 responses
      // But if it does, revert UI state and log for debugging
      console.error('toggleSaved returned success: false', result)
      saved.value = result.isSaved
      if (data.value) {
        data.value.saved = result.isSaved
      }
      // Don't show error toast here - if it's a 204 response, it's already handled
      // Only show error if we're absolutely sure it's a real error
      // But since $delete/$post handle 204, this shouldn't happen
    }
  } catch (err: any) {
    // Catch block should rarely trigger now since $delete/$post handle 204
    // But if it does, check if it's actually a success status
    const status = err?.status || err?.statusCode || err?.response?.status
    const isSuccessStatus = status === 200 || status === 201 || status === 204
    
    if (isSuccessStatus) {
      // Success status was caught as error (shouldn't happen, but handle it)
      const wasSaved = saved.value
      saved.value = !wasSaved
      if (data.value) {
        data.value.saved = !wasSaved
      }
      // Sync with store
      if (!wasSaved) {
        savedStore.savedProductIds.add(data.value.id)
        showToast(t('product_added_to_saved'), 'success')
      } else {
        savedStore.savedProductIds.delete(data.value.id)
        showToast(t('product_removed_from_saved'), 'success')
      }
    } else {
      // Real error, show error toast
      handleError(err)
    }
  } finally {
    buttonLoading.value = false
  }
}

/**
 * Map API product to expected format
 * Handles responses from both /products/offers/{id}/ and /products/list/
 */
const mapProduct = (p: any) => {
  // Get images from various possible fields (offer detail API)
  // Order: sku_images -> product_images -> images -> fallback to main_image
  const skuImages = p.sku_images || []
  const productImages = p.product_images || []
  const allImages = skuImages.length > 0 ? skuImages : productImages.length > 0 ? productImages : (p.images || [])
  
  const mainImage = allImages?.[0]?.image || allImages?.[0]?.image_1024 || p.main_image || p.image || ''
  
  // Map all images for slider
  const extraImages = allImages.length > 0
    ? allImages.map((img: any) => ({
        image: img.image || img.image_1024 || img.image_512 || img.image_256,
        image_256: img.image_256,
        image_512: img.image_512,
        image_1024: img.image_1024,
        video_url: img.video_url || null,
      }))
    : p.extra_images || []

  // Parse uom
  const uomMatch = p.uom?.match(/^([\d.]+)\s*(.+)$/)
  const uomAmount = uomMatch ? parseFloat(uomMatch[1]) : (p.product_uom_amount || null)
  const uomUnit = uomMatch ? uomMatch[2] : (p.product_uom || p.uom)

  // Get price from main_offer (new API) or direct fields (legacy)
  let price = 0
  let discountPrice = null
  let discountPercentage = null
  let hasDiscount = false

  const mainOffer = p.main_offer
  if (mainOffer) {
    // New API format with main_offer
    const originalPrice = parseFloat(mainOffer.price) || 0
    const salePrice = mainOffer.sale_price ? parseFloat(mainOffer.sale_price) : null
    hasDiscount = mainOffer.has_discount === true && salePrice !== null
    
    if (hasDiscount && salePrice) {
      price = originalPrice
      discountPrice = salePrice
      discountPercentage = mainOffer.discount_percentage || Math.round((1 - salePrice / originalPrice) * 100)
    } else {
      price = parseFloat(mainOffer.final_price) || originalPrice
    }
  } else {
    // Legacy format from /products/list/
    price = p.min_price || p.max_price || p.base_price || p.price || 0
    hasDiscount = p.has_discount === true
    discountPrice =
      hasDiscount && p.max_price && p.min_price && p.max_price > p.min_price
        ? p.min_price
        : p.discount_price || null
    const originalPrice = hasDiscount && p.max_price ? p.max_price : price

    discountPercentage = p.discount_percentage || null
    if (hasDiscount && originalPrice && discountPrice && !discountPercentage) {
      discountPercentage = Math.round((1 - discountPrice / originalPrice) * 100)
    }
    
    price = originalPrice
  }

  // Stock from total_availability (new API) or legacy fields
  const totalAvailability = p.total_availability
  const inStock = totalAvailability?.in_stock !== false && 
    (p.available_stores_count > 0 || p.in_stock !== false || totalAvailability?.total_quantity > 0)
  const maxQuantity = inStock
    ? totalAvailability?.total_quantity || p.max_quantity || p.stock || 100
    : 0

  // Get description from various possible fields
  const description = p.product_description || p.description || p.full_description || ''

  // Get specifications - combine product_specifications and sku_specifications
  let specifications = []
  if (p.product_specifications?.length || p.sku_specifications?.length) {
    // New API format
    specifications = [
      ...(p.product_specifications || []),
      ...(p.sku_specifications || [])
    ]
  } else {
    // Legacy format
    specifications = p.specifications || p.attributes || []
  }

  // Get variants - from other_variants or variant_combinations (new API) or product_variants (legacy)
  let productVariants = []
  if (p.other_variants?.length) {
    // New API format - map to expected structure for ProductVariants component
    productVariants = p.other_variants.map((v: any) => ({
      id: v.id,
      name: v.product_title || v.title || v.sku,
      sku: v.sku,
      main_image: v.images?.[0]?.image || v.images?.[0]?.image_256 || v.image || v.main_image || '',
      image: v.images?.[0]?.image || v.image,
      min_price: v.min_price,
      max_price: v.max_price,
      has_discount: v.has_discount,
      variant_options: v.variant_options,
    }))
  } else if (p.variant_combinations?.length) {
    // Alternative new API format
    productVariants = p.variant_combinations
      .filter((v: any) => !v.is_current)
      .map((v: any) => ({
        id: v.id,
        name: v.title || v.sku,
        sku: v.sku,
        main_image: v.images?.[0]?.image || v.images?.[0]?.image_256 || '',
        image: v.images?.[0]?.image,
        min_price: v.min_price,
        max_price: v.max_price,
        has_discount: v.has_discount,
        options: v.options,
      }))
  } else {
    // Legacy format - ensure main_image exists
    productVariants = (p.product_variants || p.variants || []).map((v: any) => ({
      ...v,
      main_image: v.main_image || v.image || v.images?.[0]?.image || '',
    }))
  }

  return {
    id: p.id,
    name: p.product_title || p.name || p.title || '',
    subtitle: p.sku || p.subtitle || '',
    description: description,
    price: price,
    discount_price: discountPrice,
    discount_type: hasDiscount ? 'percentage' : null,
    discount_percentage: discountPercentage,
    main_image: mainImage,
    extra_images: extraImages,
    thumbnails: {
      image_256: allImages?.[0]?.image_256 || mainImage,
      image_512: allImages?.[0]?.image_512 || mainImage,
      image_1024: allImages?.[0]?.image_1024 || mainImage,
    },
    max_quantity: maxQuantity,
    out_of_stock: !inStock,
    product_uom_amount: uomAmount,
    product_uom: uomUnit,
    is_top: p.is_top || false,
    category: p.category,
    brand: p.brand,
    tags: p.tags || [],
    specifications: specifications,
    product_variants: productVariants,
    saved: p.saved || p.is_saved || false,
    // Store additional data from new API
    main_offer: mainOffer,
    offers: p.offers || [],
    product_options: p.product_options || {},
    current_variant: p.current_variant,
  }
}

const productStore = useProductStore()
const data = ref<any>(null)
const productError = ref(false)
const productLoading = ref(true)

/**
 * Fetch product data
 * Uses /products/offers/{id}/ endpoint for authenticated users (detailed info)
 * Falls back to /products/list/ for basic data
 */
const fetchProduct = async () => {
  productLoading.value = true
  try {
    const productId = route.params.id

    // Try to fetch product detail using authenticated API first
    // This gives us full product info with images, specs, variants, offers
    try {
      const detailRes: any = await useApi().$get(`/products/offers/${productId}/`)
      if (detailRes) {
        data.value = mapProduct(detailRes)
        productStore.setCurrentProduct(data.value)
        
        // Update saved state from API response
        if (detailRes.is_saved !== undefined) {
          saved.value = detailRes.is_saved
          // Sync with saved store
          if (detailRes.is_saved) {
            savedStore.savedProductIds.add(Number(productId))
          } else {
            savedStore.savedProductIds.delete(Number(productId))
          }
        }
        return
      }
    } catch (detailErr: any) {
      // If 401 (not authenticated) or 404 (not found), try other methods
      console.log('Product offers endpoint failed, trying alternatives:', detailErr?.status || detailErr)
    }

    // Try public API endpoint
    try {
      const publicRes: any = await useChakanaApi().$get(`/products/offers/${productId}/`)
      if (publicRes) {
        data.value = mapProduct(publicRes)
        productStore.setCurrentProduct(data.value)
        
        // Sync saved state if available
        if (publicRes.is_saved !== undefined || publicRes.saved !== undefined) {
          const isSaved = publicRes.is_saved || publicRes.saved || false
          saved.value = isSaved
          if (isSaved) {
            savedStore.savedProductIds.add(Number(productId))
          }
        }
        return
      }
    } catch (publicErr) {
      console.log('Public offers endpoint not available')
    }

    // Check cached product (from card click) as fallback
    const cachedProduct = productStore.getProductById(productId as string)
    if (cachedProduct) {
      // If cached product has full data (description and images), use it
      if (cachedProduct.description && cachedProduct.extra_images?.length > 0) {
        data.value = cachedProduct
        // Sync saved state
        if (cachedProduct.saved !== undefined) {
          saved.value = cachedProduct.saved
          if (cachedProduct.saved) {
            savedStore.savedProductIds.add(Number(productId))
          }
        }
        return
      }
      // If cached but incomplete, use as initial data while we fetch full details
      data.value = cachedProduct.name ? cachedProduct : mapProduct(cachedProduct)
      // Sync saved state
      if (cachedProduct.saved !== undefined || (cachedProduct as any).is_saved !== undefined) {
        const isSaved = cachedProduct.saved || (cachedProduct as any).is_saved || false
        saved.value = isSaved
        if (isSaved) {
          savedStore.savedProductIds.add(Number(productId))
        }
      }
    }

    // Fetch from list as fallback
    const res: any = await useChakanaApi().$get(`/products/list/`)

    let productList = []
    if (Array.isArray(res)) {
      productList = res
    } else if (res?.results && Array.isArray(res.results)) {
      productList = res.results
    }

    // Find product by ID
    const product = productList.find((p: any) => p.id == productId)

    if (product) {
      data.value = mapProduct(product)
      productStore.setCurrentProduct(data.value)
      
      // Sync saved state if available
      if (product.saved !== undefined || product.is_saved !== undefined) {
        const isSaved = product.saved || product.is_saved || false
        saved.value = isSaved
        if (isSaved) {
          savedStore.savedProductIds.add(Number(productId))
        }
      }
    } else if (!data.value) {
      productError.value = true
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    if (!data.value) {
      productError.value = true
    }
  } finally {
    productLoading.value = false
  }
}

// Fetch related products
const fetchRelatedProducts = async () => {
  loading.list = true
  try {
    const categoryId = data.value?.category?.id
    let url = '/products/list/?limit=8'
    if (categoryId) {
      url += `&category_id=${categoryId}`
    }

    const res: any = await useChakanaApi().$get(url)

    let productList = []
    if (Array.isArray(res)) {
      productList = res
    } else if (res?.results && Array.isArray(res.results)) {
      productList = res.results
    }

    // Exclude current product and map
    relatedProducts.value = productList
      .filter((p: any) => p.id != route.params.id)
      .slice(0, 8)
      .map(mapProduct)

    paginationData.value.count = relatedProducts.value.length
  } catch (err) {
    console.error('Error fetching related products:', err)
  } finally {
    loading.list = false
  }
}

// Initialize on mount
onMounted(async () => {
  await fetchProduct()
  if (data.value) {
    await fetchRelatedProducts()
  }
})

// Watch for route changes
watch(
  () => route.params.id,
  async () => {
    await fetchProduct()
    if (data.value) {
      await fetchRelatedProducts()
    }
  }
)

const images = computed(() => {
  return data.value?.extra_images?.length > 0
    ? data.value.extra_images
    : [
        {
          image: getImageSize(data.value, data.value?.main_image, 'large'),
          video_url: null,
        },
      ]
})

// Show 404 if product not found
watch(productError, (hasError) => {
  if (hasError) {
    showError({ statusCode: 404 })
  }
})

// Initialize saved state from store
watch(() => data.value?.id, (productId) => {
  if (productId) {
    const isSaved = savedStore.isProductSaved(productId) || data.value?.saved || false
    saved.value = isSaved
    // Sync with store
    if (isSaved) {
      savedStore.savedProductIds.add(Number(productId))
    }
  }
}, { immediate: true })

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

// SEO meta with computed values
const seoTitle = computed(() => data.value?.name || 'Продукт')
const seoDescription = computed(() =>
  data.value?.description ? htmlToText(data.value.description) : ''
)
const seoImage = computed(() => data.value?.main_image || '')

useHead({
  title: seoTitle,
})

useSeoMeta({
  description: seoDescription,
  ogDescription: seoDescription,
  ogTitle: seoTitle,
  twitterTitle: seoTitle,
  twitterCard: 'summary',
  twitterSite: '@chakana',
  ogImage: seoImage,
  twitterImage: seoImage,
})

const descriptionRef = ref<HTMLElement | null>(null)
const isTextTruncated = ref(false)

// Check if text is truncated (needs "show more" arrow)
const checkTextTruncation = () => {
  // Only check when collapsed (line-clamp is active)
  if (open.value) return
  
  // Use setTimeout to ensure DOM has fully rendered
  setTimeout(() => {
    if (descriptionRef.value) {
      const element = descriptionRef.value
      // Check if content is taller than visible area (line-clamp-3)
      // scrollHeight is the full content height, clientHeight is visible height
      const isTruncated = element.scrollHeight > element.clientHeight + 1 // +1 for rounding
      isTextTruncated.value = isTruncated
    }
  }, 100)
}

const shouldShowArrow = computed(() => isTextTruncated.value)

// Re-check when description changes
watch(() => data.value?.description, (newDesc) => {
  if (newDesc) {
    // Reset and re-check
    isTextTruncated.value = false
    checkTextTruncation()
  }
}, { immediate: true })

onMounted(() => {
  // Delay check to ensure content is rendered
  setTimeout(() => {
    checkTextTruncation()
  }, 200)
})

const localePath = useLocalePath()
const storePageStore = useStorePageStore()

const back = () => {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push(localePath('/'))
  }
}

// Reset store context when leaving product page (unless going back to store)
onBeforeRouteLeave((to, from, next) => {
  const isNavigatingToStore = to.path.includes('/store/')
  const isNavigatingToProduct = to.path.includes('/product/')

  // Only reset if not staying in store context
  if (
    !isNavigatingToStore &&
    !isNavigatingToProduct &&
    storePageStore.isStorePage
  ) {
    storePageStore.reset()
  }
  next()
})
</script>

<style scoped>
.swiper-slide-thumb-active {
  border: 2px solid #ED2024 !important;
  border-radius: 10px !important;
  opacity: 100%;
}
</style>
