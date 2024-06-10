<script setup lang="ts"></script>

<template>
  <div
    v-for="(item, index) in list"
    :key="index"
    :class="addressIdx === index ? '!border-orange' : ''"
    class="bg-gray-300 p-3 rounded-xl w-full cursor-pointer group border border-transparent hover:border-orange transition-300"
    @click="handleAddress(index)"
  >
    <div class="flex-center-between">
      <img :src="item.icon" alt="" width="24px" height="24px" />
      <div
        class="bg-white rounded-full w-5 h-5 border-2 border-gray-200 transition-300"
        :class="addressIdx === index ? 'border-orange border-[5px]' : ''"
      ></div>
    </div>
    <h3 class="mt-3 text-dark font-bold">{{ item.address }}</h3>
    <p class="line-clamp-1 text-xs text-gray-100 mt-1">
      {{ item.street }}
    </p>
  </div>
</template>

<style scoped></style>
