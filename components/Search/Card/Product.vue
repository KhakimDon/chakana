<template>
  <div class="flex-y-center gap-2 justify-between rounded-xl px-4 py-3">
    <div class="flex-y-center gap-2">
      <div
        class="border bg-white border-white-100 w-16 relative h-[52px] rounded-10 px-0.5"
      >
        <NuxtImg
          :src="product?.main_image"
          class="w-full h-fit absolute -bottom-1 object-cover object-center"
        />
      </div>
      <div class="space-y-0.5">
        <p class="text-[13px] font-semibold leading-none text-dark">
          {{ product?.name }}
        </p>
        <p class="text-xs font-medium leading-130 text-gray-400">
          {{ product?.weight }} {{ product?.weight_measure }}
        </p>
      </div>
    </div>
    <div class="w-24">
      <BaseButton
        v-if="count < 1"
        class="w-24"
        :text="$t('to_basket')"
        variant="outline"
        @click="count++"
      />
      <MainCardCounter
        v-else
        v-model="count"
        :default-count="count"
        class="w-24 border-none bg-white-100"
        readonly
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  product: any
}

defineProps<Props>()
const count = ref(0)
</script>

<style scoped></style>
