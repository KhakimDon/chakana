<script setup lang="ts">
const { list } = useListFetcher('/saved/address')

const addAddressModal = ref(false)
</script>

<template>
  <div>
    <div class="flex-center-between mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('addresses') }}
      </h1>
      <button
        class="flex-y-center gap-1 text-red text-sm font-semibold leading-5 transition-300 group hover:text-orange"
        @click="addAddressModal = true"
      >
        <SvgoCommonPlus
          class="text-xl leading-5 text-red transition-300 group-hover:text-orange"
        />
        {{ $t('add_address') }}
      </button>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="bg-gray-300 p-3 rounded-xl w-full cursor-pointer group border border-transparent hover:border-orange transition-300 transition-300 group"
      >
        <div class="flex-center-between">
          <img :src="item.icon" :alt="item.title" width="24px" height="24px" />
          <SvgoCommonEditPenSquare
            class="text-2xl leading-6 text-gray group-hover:text-orange transition-300"
          />
        </div>
        <h3 class="mt-3 text-dark font-bold">{{ item.title }}</h3>
        <p class="line-clamp-1 text-xs text-gray-100 mt-1">
          {{ item.street }}
        </p>
      </div>
    </div>
    <CommonModalMap v-model="addAddressModal" />
  </div>
</template>
