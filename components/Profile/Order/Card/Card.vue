<template>
  <div>
    <div class="p-3 bg-gray-300 rounded-xl">
      <!-- Card header -->
      <div
        class="grid gap-px h-40 rounded-lg border border-white-100 cursor-pointer overflow-hidden"
        :class="[
          images.length > 2 ? 'grid-rows-2' : 'grid-rows-1',
          { 'grid-cols-2': images.length > 1 },
        ]"
      >
        <div
          v-for="(image, i) in images"
          :key="i"
          class="relative flex items-center bg-white"
          :class="{
            'col-span-2': i == 2 && images?.length == 3,
          }"
        >
          <img :src="image" alt="product-image" class="max-h-full mx-auto" />

          <!-- 4-image overlaps shade for over 4 img case -->
          <div
            v-if="i === 3 && images?.length > 4"
            class="absolute top-0 flex items-center justify-center w-full h-full bg-dark/60"
          >
            <span class="text-lg text-white font-bold"
              >+{{ images?.length - 3 }}</span
            >
          </div>
        </div>
      </div>

      <!-- Card body -->
      <div class="my-3">
        <slot name="body" :data="item">
          <div class="flex justify-between mb-1.5">
            <p class="text-gray-100 text-xs font-semibold leading-130">
              {{ $t('order_number') }}:
            </p>
            <span class="text-sm font-bold text-dark leading-130">
              #{{ item.id }}
            </span>
          </div>

          <ProfileOrderCardBadge :type="item?.status" />
        </slot>

        <hr class="my-2.5 border-gray-200" />

        <div v-if="!autoOrder" class="flex justify-between mb-1.5 text-xs">
          <p class="text-gray-100 font-semibold leading-130">
            {{ $t('order_date') }}:
          </p>
          <span class="font-bold text-dark leading-130">
            {{ dayjs(item.date_order).format('DD.MM.YYYY') }}
          </span>
        </div>

        <div class="flex items-end text-dark font-extrabold">
          <p class="text-xl mr-0.5 leading-130">
            {{ formatMoneyDecimal(item.total_real_price ?? item.price) }}
          </p>
          <span class="text-[15px] leading-140">UZS</span>
        </div>
      </div>

      <!-- Card footer -->
      <NuxtLinkLocale
        :to="`/profile/${autoOrder ? 'auto-order' : 'order'}/${item.id}`"
      >
        <BaseButton
          variant="outline"
          :text="$t('more_info_product')"
          class="group bg-white border-white-100 rounded-[10px] w-full font-semibold !py-2"
          main-class="justify-between text-[13px] leading-120"
        >
          <template #suffix>
            <SvgoCommonChevron
              class="rotate-180 text-xl leading-5 text-gray transition-300 group-hover:text-white shrink-0"
            />
          </template>
        </BaseButton>
      </NuxtLinkLocale>
    </div>

    <!-- Offer reorder -->
    <!--  For later usage  -->
    <BaseButton
      v-if="(offerReorder && false) || autoOrder"
      variant="secondary"
      :text="$t(autoOrder ? 'delete_order' : 'reorder')"
      class="w-full mt-3 font-semibold"
      :loading="deleteLoading"
      @click="extraAction"
    >
      <template #prefix>
        <component
          :is="autoOrder ? 'SvgoCommonTrash' : 'SvgoCommonRefresh'"
          class="text-xl leading-5"
        />
      </template>
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import { useOrderStore } from '~/store/profile/orders.js'
import type { IOrderCard } from '~/types/profile.js'
import { formatMoneyDecimal } from '~/utils/functions/common.js'

interface Props {
  item: IOrderCard
  offerReorder?: boolean
  autoOrder?: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: 'delete', v: number): void
}
const emit = defineEmits<Emits>()

const { showToast } = useCustomToast()
const { handleError } = useErrorHandling()
const { t } = useI18n()

// max 4 images
const images = computed(() => {
  if (props.item.images.length > 4) return props.item.images.slice(0, 4)
  else return props.item.images
})

const orderStore = useOrderStore()
const deleteLoading = ref(false)
function extraAction() {
  if (props.autoOrder) {
    deleteLoading.value = true
    orderStore
      .deleteAutoOrder(props.item.id)
      .then(() => {
        showToast(t('auto_order_deleted_successfully'), 'success')
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        deleteLoading.value = false
      })
  }
}
</script>
