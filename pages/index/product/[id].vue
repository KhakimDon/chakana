<template>
  <div>
    <div>
      <h1 class="text-[22px] font-bold leading-130 text-dark">
        {{ data?.name }}
      </h1>
      <p class="text-base font-medium text-gray-100">
        {{ data?.weight }} {{ data?.weight_measure }}
      </p>
      <div class="grid grid-cols-9 gap-5 mt-4">
        <div class="max-w-[313px] shrink-0 col-span-4">
          <div
            class="flex-center bg-white-100 rounded-2xl w-full min-h-[313px] p-3 mb-4"
          >
            <NuxtImg
              :src="data?.main_image"
              alt="card-image"
              class="w-full h-full object-contain"
              loading="lazy"
            />
          </div>

          <Swiper :slides-per-view="'auto'" :space-between="12" centered-slides>
            <SwiperSlide
              v-for="(item, index) in data?.extra_images"
              :key="index"
              class="!w-11"
            >
              <div
                class="relative flex-center bg-white-100 rounded-10 w-11 h-11"
              >
                <NuxtImg
                  :src="item?.image"
                  alt="card-image"
                  class="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div class="col-span-5">
          <p class="text-[28px] font-bold leading-122 text-dark">
            {{ formatMoneyDecimal(data?.price) }}
            <span class="text-[22px] leading-130 font-semibold">UZS</span>
          </p>

          <div class="flex-y-center gap-2">
            <div class="w-full flex-y-center gap-2 mt-4">
              <BaseButton
                v-if="count < 1"
                class="w-full"
                :text="$t('to_basket')"
                variant="secondary"
                @click.stop="count++"
              >
                <template #prefix>
                  <IconCart />
                </template>
              </BaseButton>
              <MainCardCounter
                v-else
                v-model="count"
                :default-count="count"
                readonly
                @click.stop
              />

              <BaseButton
                variant="outline"
                class="hover:!bg-transparent hover:!text-dark hover:!border-orange"
              >
                <IconExport class="text-xl" />
              </BaseButton>
              <BaseButton
                variant="outline"
                class="hover:!bg-transparent hover:!text-dark hover:!border-orange"
              >
                <IconHeartPlus class="text-xl" />
              </BaseButton>
            </div>
          </div>

          <div>
            <ProductVariants :variants="data?.product_variants" />
          </div>

          <div
            v-if="data?.description"
            class="h-px w-full bg-white-100 mt-5 mb-4"
          />

          <div v-if="data?.description">
            <h4 class="text-lg !leading-normal font-bold text-dark">
              {{ $t('description') }}
            </h4>

            <div
              class="text-gray-100 leading-140 text-sm mt-2"
              v-html="data?.description"
            />
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
          <MainCardLoading v-for="key in 16" :key />
        </div>
        <div v-else-if="list?.length" class="grid grid-cols-5 gap-4">
          <MainCard v-for="(card, index) in list" :key="index" :card />
          <!--            @open="selectProduct(card)"-->
        </div>
        <div v-else>
          <CommonNoData class="col-span-4" />
        </div>
      </Transition>
      <div v-if="loading?.button" class="grid grid-cols-5 gap-4">
        <MainCardLoading v-for="key in 12" :key />
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
  </div>
</template>
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { Swiper, SwiperSlide } from 'swiper/vue'

import IconCart from '~/assets/icons/Common/cart.svg'
import IconExport from '~/assets/icons/Common/export.svg'
import IconHeartPlus from '~/assets/icons/Common/heart-plus.svg'
import { formatMoneyDecimal } from '~/utils/functions/common'

const { list, loading, paginationData, loadMore } = useListFetcher(
  'recommend/products',
  25,
  true
)

const route = useRoute()
const count = ref(0)

const { data, error } = (await useAsyncData('product', async () => {
  return await useApi().$get(`/product/${route?.params.id}`)
})) as any

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
</script>
