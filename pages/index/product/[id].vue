<template>
  <div>
    <div>
      <h1 class="text-[22px] font-bold leading-130 text-dark">
        {{ data?.name }}
      </h1>
      <p class="text-base font-medium text-gray-100">
        {{ data?.weight }} {{ data?.weight_measure }}
      </p>
      <div class="flex gap-5 w-full h-full mt-4">
        <div
          class="flex-center bg-white-100 rounded-2xl w-full h-full min-h-[313px] p-3 max-w-[313px]"
        >
          <NuxtImg
            :src="data?.main_image"
            alt="card-image"
            class="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        <div class="w-full">
          <p class="text-[28px] font-bold leading-122 text-dark">
            {{ formatMoneyDecimal(data?.price) }}
            <span class="text-[22px] leading-130 font-semibold">UZS</span>
          </p>

          <div class="flex-y-center gap-2">
            <div class="w-full flex-y-center gap-2">
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

              <BaseButton variant="outline">
                <IconExport class="text-xl" />
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconCart from '~/assets/icons/Common/cart.svg'
import IconExport from '~/assets/icons/Common/export.svg'
import { formatMoneyDecimal } from '~/utils/functions/common'

const route = useRoute()
const count = ref(0)

const { data, error } = (await useAsyncData('product', async () => {
  return await useApi().$get(`product/${route?.params.id}`)
})) as any

if (error.value) {
  showError({
    statusCode: 404,
  })
}

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
