<template>
  <div>
    <div
      class="flex items-center gap-1 text-gray-100 cursor-pointer group md:hidden"
      @click="router.back()"
    >
      <IconChevron
        class="cursor-pointer text-gray-100 group-hover:-translate-x-1 transition-300 group-hover:text-orange"
      />
      <p class="text-gray-100 group-hover:text-orange transition-300">
        {{ $t('back') }}
      </p>
    </div>
    <CommonSectionWrapper title="discounts">
      <Transition name="fade" mode="out-in">
        <div
          :key="discounts?.loading"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <template v-if="discounts?.loading">
            <MainCardLoading v-for="key in 12" :key />
          </template>
          <template v-else-if="!discounts?.loading && discounts?.list.length">
            <MainCard
              v-for="(card, index) in discounts?.list"
              :key="index"
              :card
            />
          </template>
          <template v-else>
            <CommonNoData class="col-span-4" />
          </template>
          <template v-if="discounts?.params?.loading">
            <MainCardLoading v-for="key in 8" :key />
          </template>
        </div>
      </Transition>
      <div
        v-if="
          discounts.params?.total > discounts?.list.length &&
          !discounts?.loading &&
          !discounts?.params?.loading
        "
        ref="target"
      />
    </CommonSectionWrapper>
  </div>
</template>
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import IconChevron from 'assets/icons/Common/chevron.svg'

import { useDiscountsStore } from '~/store/discounts'

const discountsStore = useDiscountsStore()

const discounts = computed(() => discountsStore.discounts)

if (!discounts.value?.list.length) {
  discountsStore.fetchDiscounts()
}

const router = useRouter()

const target = ref<HTMLElement | null>(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    discountsStore.fetchDiscounts(false)
  }
})
</script>
