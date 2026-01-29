<template>
  <section class="mb-24 md:space-y-0 space-y-6">
    <!-- Mobile Back Button Shimmer -->
    <div class="flex items-center gap-1 md:hidden">
      <div class="shimmer w-4 h-4 rounded" />
      <div class="shimmer w-16 h-4 rounded" />
    </div>

    <!-- Desktop Title Shimmer -->
    <div class="hidden md:block">
      <div class="shimmer w-48 h-6 rounded mb-2" />
      <div class="shimmer w-32 h-4 rounded" />
    </div>

    <div>
      <div class="grid grid-cols-1 md:grid-cols-9 gap-6 mt-4">
        <!-- Left Column: Product Images Shimmer -->
        <div class="col-span-12 md:col-span-4">
          <!-- Main Image Shimmer -->
          <div class="bg-white rounded-2xl w-full min-h-[280px] md:min-h-[320px] p-4 flex-center border border-gray-100/20">
            <div class="shimmer w-full h-[240px] md:h-[280px] rounded-xl" />
          </div>
          <!-- Thumbnail Gallery Shimmer -->
          <div class="flex gap-2 mt-3">
            <div v-for="i in 4" :key="i" class="shimmer w-11 h-11 rounded-lg" />
          </div>
        </div>

        <!-- Right Column: Product Info Shimmer -->
        <div class="col-span-12 md:col-span-5">
          <!-- Mobile Title Shimmer -->
          <div class="md:hidden mb-3">
            <div class="shimmer w-40 h-6 rounded mb-2" />
            <div class="shimmer w-28 h-4 rounded" />
          </div>

          <!-- Price Shimmer -->
          <div class="mb-4 md:mb-5">
            <div class="shimmer w-32 h-8 rounded mb-2" />
            <div class="shimmer w-24 h-4 rounded" />
          </div>

          <!-- Action Buttons Shimmer -->
          <div class="flex items-center gap-2 md:gap-3 mb-6">
            <div class="shimmer w-32 h-11 rounded-xl" />
            <div class="shimmer w-11 h-11 rounded-xl" />
            <div class="shimmer w-11 h-11 rounded-xl" />
          </div>

          <!-- Description Shimmer -->
          <div class="mb-6">
            <div class="h-px w-full bg-gray-200 mb-4" />
            <div class="shimmer w-24 h-5 rounded mb-2" />
            <div class="space-y-2">
              <div class="shimmer w-full h-4 rounded" />
              <div class="shimmer w-full h-4 rounded" />
              <div class="shimmer w-3/4 h-4 rounded" />
            </div>
          </div>

          <!-- Specifications Shimmer -->
          <div>
            <div class="h-px w-full bg-gray-200 mb-4" />
            <div class="shimmer w-32 h-5 rounded mb-3" />
            <div class="space-y-3">
              <div v-for="i in 4" :key="i" class="flex justify-between">
                <div class="shimmer w-24 h-4 rounded" />
                <div class="shimmer w-32 h-4 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.shimmer {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
