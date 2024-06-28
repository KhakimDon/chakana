<template>
  <div>
    <CommonBack v-if="useMobile('mobile')" to="/profile" />
    <div class="flex-center-between mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('auto_order') }}
      </h1>
      <NuxtLinkLocale
        to="/search"
        class="flex-y-center gap-1 text-red text-sm font-semibold leading-5 transition-300 group hover:text-orange"
      >
        <SvgoCommonPlus
          class="text-xl leading-5 text-red transition-300 group-hover:text-orange"
        />
        {{ $t('new_auto_order') }}
      </NuxtLinkLocale>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <template v-if="orders.loading">
        <ProfileOrderCardLoading v-for="i in 6" :key="i" />
      </template>
      <template v-else-if="orders.list.length">
        <ProfileOrderCard
          v-for="item in orders.list"
          :key="item.id"
          :item="item"
          auto-order
          :extra-button-loading="deleteLoading"
          @delete="deleteAutoOrder"
        >
          <template #body="{ data }">
            <div class="flex justify-between mb-1.5 flex-col gap-0.5">
              <p class="text-gray-100 text-xs font-semibold leading-130">
                {{ $t('name') }}:
              </p>
              <span class="text-sm font-bold text-dark leading-130">
                {{ data.name }}
              </span>
            </div>
            <div class="flex justify-between mb-1.5 flex-col gap-0.5 mt-2.5">
              <p class="text-gray-100 text-xs font-semibold leading-130">
                {{ $t('date_delivery') }}:
              </p>
              <span class="text-sm font-bold text-dark leading-130">
                {{ data.delivery_date }}
              </span>
            </div>
          </template>
        </ProfileOrderCard>
      </template>
      <template v-else>
        <CommonNoData class="col-span-3" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrderStore } from '~/store/profile/orders.js'

const orderStore = useOrderStore()

const orders = computed(() => orderStore.autoOrder)
orderStore.fetchAutoOrders()
</script>
