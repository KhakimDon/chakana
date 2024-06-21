<template>
  <NuxtLinkLocale :to class="flex-y-center gap-1 mb-3 text-gray-100">
    <SvgoCommonChevron class="text-xl leading-5" />
    {{ $t('back') }}
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import type { RouteLocation } from 'vue-router'

interface Props {
  to?: RouteLocation
}
defineProps<Props>()
</script>
