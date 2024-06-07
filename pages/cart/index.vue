<template>
  <LayoutWrapper>
    <Transition name="fade" mode="out-in">
      <div :key="$route.name">
        <div class="flex-y-center gap-1 cursor-pointer" @click="goBack">
          <SvgoCommonChevron class="text-base text-gray-100" />
          <p class="text-sm font-semibold text-gray-100">
            {{ $t('go_back') }}
          </p>
        </div>
        <div class="flex-y-center justify-between mt-3">
          <p class="text-[22px] font-extrabold leading-7">
            {{ $t('basket') }}
          </p>
          <div class="flex-center gap-2 group cursor-pointer select-none">
            <SvgoCommonTrash
              class="text-base text-gray-100 group-hover:text-red transition-300"
            />
            <p
              class="text-xs font-semibold text-gray-100 group-hover:text-red transition-300"
            >
              {{ $t('clear_basket') }}
            </p>
          </div>
        </div>
        <div class="">
          <SearchCardProduct
            v-for="(product, key) in products.list"
            :key
            :product="product"
            :class="{ 'bg-gray-300/50': key % 2 === 0 }"
          />
        </div>
      </div>
    </Transition>
    <template #right> RIGHT </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/store/search.js'

const router = useRouter()
const searchStore = useSearchStore()

const products = computed(() => searchStore.products)
const goBack = () => {
  router.back()
}
</script>

<style scoped></style>
