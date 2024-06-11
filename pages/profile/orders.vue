<template>
  <div>
    <div class="flex flex-col gap-4 mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('orders') }}
      </h1>
      <BaseTab v-model="tab" :list="tabList" />
    </div>

    <NuxtPage
      :transition="{
        name: 'fade',
        mode: 'out-in',
      }"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const tab = ref(route.meta.page)

const localePath = useLocalePath()

const tabList = [
  {
    label: t('active'),
    value: 'active',
  },
  {
    label: t('archive'),
    value: 'archive',
  },
]

watch(
  () => tab.value,
  () => {
    if (tab.value === 'active') {
      router.push(localePath('/profile/orders'))
    } else {
      router.push(localePath('/profile/orders/archive'))
    }
  }
)
</script>
