<template>
  <CommonSectionWrapper title="discounts">
    <Transition name="fade" mode="out-in">
      <div :key="discounts?.loading" class="grid grid-cols-4 gap-4">
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
</template>
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

import { useDiscountsStore } from '~/store/discounts'

const discountsStore = useDiscountsStore()

const discounts = computed(() => discountsStore.discounts)

if (!discounts.value?.list.length) {
  discountsStore.fetchDiscounts()
}

const target = ref<HTMLElement | null>(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    discountsStore.fetchDiscounts(false)
  }
})
</script>
