<template>
  <CommonSectionWrapper title="take_and_go" class="mt-4">
    <Transition name="fade" mode="out-in">
      <div :key="loading" class="grid grid-cols-4 gap-x-4 gap-y-10">
        <template v-if="loading">
          <MainCardLoading v-for="key in 16" :key />
        </template>
        <template v-if="!loading && list?.length">
          <MainCard v-for="(card, index) in list" :key="index" :card />
        </template>
        <template v-else>
          <CommonNoData class="col-span-4" />
        </template>
      </div>
    </Transition>
  </CommonSectionWrapper>
</template>
<script setup lang="ts">
const route = useRoute()

const loading = ref(true)
const list = ref()

useApi()
  .$get(`/products/${route.params.slug}?page=1&page_size=20`)
  .then((res: any) => {
    list.value = res.items
  })
  .finally(() => {
    loading.value = false
  })
</script>
