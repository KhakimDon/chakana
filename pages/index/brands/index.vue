<template>
  <CommonSectionWrapper title="brands">
    <Transition name="fade" mode="out-in">
      <div :key="brands?.loading" class="grid grid-cols-5 gap-4">
        <template v-if="brands?.loading">
          <MainBrandsCardLoading v-for="key in 16" :key />
        </template>
        <template v-else-if="!brands?.loading && brands?.list.length">
          <MainBrandsCard
            v-for="(card, index) in brands?.list"
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
import { useMainStore } from '~/store/main.js'

const mainStore = useMainStore()

const brands = computed(() => mainStore.brands)

if (!brands.value?.list.length) {
  mainStore.fetchBrands()
}
</script>
