<template>
  <div class="py-3 px-4 bg-gray-300 rounded-xl">
    <p class="mb-2 text-sm leading-140 font-medium text-gray-100">
      {{ $t('courier') }}
    </p>
    <div class="flex items-center gap-3 justify-between">
      <div class="flex items-center gap-3">
        <div class="border border-white-100 rounded-full w-12 h-12">
          <img
            class="w-full h-full rounded-full object-cover shrink-0"
            :src="courier.image"
            :alt="courier.full_name"
          />
        </div>
        <p class="text-sm leading-130 font-bold text-dark">
          {{ courier.full_name }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="h-9 w-px bg-gray-200"></div>
        <BaseButton
          class="!bg-gray-200 hover:!bg-white"
          :text="$t('write_to_courier')"
          variant="secondary"
          @click="messageModal = true"
        >
          <template #prefix>
            <SvgoProfileMessage class="text-xl leading-5" />
          </template>
        </BaseButton>
        <a v-if="courier.phone" :href="`tel:${courier.phone}`">
          <BaseButton :text="formatPhoneNumber(courier.phone)" variant="green">
            <template #prefix>
              <SvgoCommonPhone class="text-xl leading-5" />
            </template>
          </BaseButton>
        </a>
      </div>
    </div>
    <BaseModal v-model="messageModal" :title="$t('write_to_courier')">
      <FormTextarea :rows="5" :placeholder="$t('enter_text')" />
      <BaseButton class="mt-4 w-full" :text="$t('send')" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { formatPhoneNumber } from '~/utils/functions/common.js'

const messageModal = ref(false)

interface Props {
  courier: {
    id: number
    full_name: string
    phone: string
    image: string
  }
}
defineProps<Props>()
</script>
