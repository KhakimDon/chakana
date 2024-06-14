<template>
  <div class="max-md:pt-4">
    <CommonBack v-if="useMobile('mobile')" to="/profile" />
    <div class="flex-center-between mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('notifications') }}
      </h1>
      <button
        class="flex-y-center gap-1 text-red text-sm font-semibold leading-5 transition-300 group hover:text-orange"
      >
        <SvgoProfileChecks
          class="text-xl leading-5 text-red transition-300 group-hover:text-orange"
        />
        {{ $t('read_all') }}
      </button>
    </div>
    <Transition name="fade" mode="out-in">
      <div :key="data.loading" class="flex flex-col gap-4">
        <template v-if="data.loading">
          <ProfileNotificationCardLoading v-for="i in 10" :key="i" />
        </template>
        <template v-else-if="data.list.length">
          <ProfileNotificationCard
            v-for="(item, i) in data.list"
            :key="i"
            :item
          />
        </template>
        <CommonNoData
          v-else
          image="/images/no-data/no-notifications.svg"
          :title="$t('no_notifications_yet')"
          :subtitle="$t('you_have_not_received_any_notifications')"
        />
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { useNotificationsStore } from '~/store/profile/notifications.js'

const notifications = useNotificationsStore()

const data = computed(() => notifications.notifications)
notifications.fetchNotifications()
</script>
