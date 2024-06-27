<template>
  <section class="mb-24">
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
    <CommonSectionWrapper title="brands">
      <Transition name="fade" mode="out-in">
        <div
          :key="brands?.loading"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <template v-if="brands?.loading">
            <MainBrandsCardLoading v-for="key in 16" :key />
          </template>
          <template v-else-if="!brands?.loading && brands?.list.length">
            <MainBrandsCard
              v-for="(card, index) in brands?.list"
              :key="index"
              :card
            />

            <div
              v-if="
                brands.params?.total > brands.list.length &&
                !brands?.loading &&
                !brands?.params?.loading
              "
              ref="target"
            />
          </template>
          <template v-else>
            <CommonNoData class="col-span-4" />
          </template>
          <template v-if="brands?.params?.loading">
            <MainCardLoading v-for="key in 10" :key />
          </template>
        </div>
      </Transition>
    </CommonSectionWrapper>
  </section>
</template>
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import IconChevron from 'assets/icons/Common/chevron.svg'

import { useMainStore } from '~/store/main.js'

const mainStore = useMainStore()

const brands = computed(() => mainStore.brands)

if (!brands.value?.list.length) {
  mainStore.fetchBrands()
}

const target = ref<HTMLElement | null>(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    mainStore.fetchBrands(false)
  }
})

const router = useRouter()

const localePath = useLocalePath()

const back = () => {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push(localePath('/'))
  }
}
</script>
