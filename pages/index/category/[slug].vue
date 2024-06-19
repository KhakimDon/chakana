<template>
  <CommonSectionWrapper
    :title="useMobile('desktop') ? 'take_and_go' : single?.name"
    class="md:mt-4"
  >
    <template #top>
      <NuxtLinkLocale
        to="/categories"
        class="flex items-center gap-1 text-gray-100 cursor-pointer group mb-3"
      >
        <IconChevron
          class="cursor-pointer text-gray-100 group-hover:-translate-x-1 transition-300 group-hover:text-orange"
        />
        <p class="text-gray-100 group-hover:text-orange transition-300">
          {{ $t('back') }}
        </p>
      </NuxtLinkLocale>
    </template>
    <template #action>
      <BaseButton
        variant="secondary"
        class="!size-8 !p-0"
        @click="isOpenFilter = true"
      >
        <IconFilter class="text-gray-100 text-[22px]" />
      </BaseButton>
    </template>
    <Transition name="fade" mode="out-in">
      <div
        :key="loading"
        class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-10"
      >
        <template v-if="loading">
          <MainCardLoading v-for="key in 16" :key />
        </template>
        <template v-if="!loading && list?.length">
          <MainCard v-for="(card, index) in list" :key="index" :card />
        </template>
        <template v-else>
          <CommonNoData class="col-span-2 sm:col-span-4" />
        </template>
        <template v-if="loadingMore">
          <MainCardLoading v-for="key in 12" :key />
        </template>
      </div>
    </Transition>
    <div
      v-if="params?.count > list?.length && !loading && !loadingMore"
      ref="target"
    />

    <Transition name="from-right" mode="out-in">
      <MainCategoriesFilter v-if="isOpenFilter" @close="isOpenFilter = false" />
    </Transition>
  </CommonSectionWrapper>
</template>
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconFilter from '~/assets/icons/Common/filter.svg'
import { useCategoriesStore } from '~/store/categories'
import { debounce } from '~/utils/functions/common'

const categoriesStore = useCategoriesStore()
const route = useRoute()

const isOpenFilter = ref(false)
const loading = ref(true)
const loadingMore = ref(false)
const single = computed(() => categoriesStore.single)
const params = reactive({
  page: 1,
  page_size: 24,
  count: 0,
})

const list = ref()
const categories = computed(() => {
  if (route.query.categories?.length) {
    return [...route.query.categories?.split(',')?.map((id) => Number(id))]
  } else {
    return [Number(route.params.slug)]
  }
})

function fetchData(force = true) {
  if (force) {
    loading.value = true
    params.page = 1
  } else {
    params.page += 1
    loadingMore.value = true
  }
  useApi()
    .$post(`/products/category`, {
      params: {
        page: params.page,
        page_size: params.page_size,
      },
      body: {
        ids: categories.value,
      },
    })
    .then((res: any) => {
      if (force) {
        list.value = res.items
      } else {
        list.value = [...list.value, ...res.items]
      }
      params.count = res.count
    })
    .finally(() => {
      loadingMore.value = false
      loading.value = false
    })
}

fetchData()

// ToDo: convert to useAsyncData and use seo meta with one request
function getSingle() {
  useApi()
    .$get(`category/${route.params.slug}`)
    .then((res: any) => {
      categoriesStore.single = res
    })
}
getSingle()

const target = ref<HTMLElement | null>(null)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    fetchData(false)
  }
})

watch(
  () => categories?.value,
  () => {
    debounce('fetch-categories', () => fetchData(), 500)
  }
)

const { data } = await useAsyncData<any>('single', () =>
  useApi().$get(`category/${route.params.slug}`)
)

useSeoMeta({
  title: data.value?.name,
  description: data.value?.name,
  ogTitle: data.value?.name,
  twitterTitle: data.value?.name,
  twitterCard: 'summary',
})
</script>

<style scoped>
.from-right-enter-active,
.from-right-leave-active {
  transition: all 0.3s ease-in-out;
}

.from-right-enter-from,
.from-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.from-right-enter-to,
.from-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
