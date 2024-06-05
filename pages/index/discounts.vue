<template>
  <CommonSectionWrapper title="discounts">
    <Transition name="fade" mode="out-in">
      <div :key="discounts?.loading" class="grid grid-cols-4 gap-4">
        <template v-if="discounts?.loading">
          <MainCardLoading v-for="key in 16" :key />
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
      </div>
    </Transition>
  </CommonSectionWrapper>
</template>
<script setup lang="ts">
import { useMainStore } from '~/store/main'

const mainStore = useMainStore()

const discounts = computed(() => mainStore.discounts)

if (!discounts.value?.list.length) {
  mainStore.fetchDiscounts()
}
</script>
