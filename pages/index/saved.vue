<template>
  <CommonSectionWrapper title="saved">
    <template #header>
      <div class="flex items-center">
        <IconChevron class="text-gray" />
        <p class="text-gray-100 text-sm">{{ $t('go_back') }}</p>
      </div>
    </template>
  </CommonSectionWrapper>
</template>
<script setup lang="ts">
import IconChevron from '~/assets/icons/Common/chevron.svg'
</script>
<style scoped></style>
