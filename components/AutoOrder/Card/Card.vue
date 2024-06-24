<template>
  <section class="space-y-4">
    <div class="bg-white-100 rounded-xl space-y-3 py-3 px-4">
      <div class="flex items-center justify-between">
        <p>{{ $t('auto_order') }}</p>
        <FormToggle
          v-model="isAutoOrder"
          class="text-2xl"
          @change="toggleAutoOrder"
        />
      </div>
      <Transition name="fade" mode="out-in">
        <div v-if="isAutoOrder">
          <AutoOrderSectionOrderName />
          <AutoOrderSectionClockLocation />
          <AutoOrderSectionPaymentMethod />
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
const isAutoOrder = ref(false)

const toggleAutoOrder = () => {
  isAutoOrder.value = !isAutoOrder.value
}
</script>

<style scoped></style>
