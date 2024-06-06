<template>
  <BaseModal
    v-bind="{ show }"
    body-class="!max-w-[424px]"
    :title="$t('address_delivery')"
    @close="$emit('close')"
  >
    <div class="flex items-center gap-4">
      <div
        :class="address.home ? 'border-orange' : ''"
        class="bg-gray-300 p-3 rounded-xl w-full cursor-pointer group border border-transparent hover:border-orange transition-300"
        @click="handleAddress"
      >
        <div class="flex-center-between">
          <IconHouse class="text-2xl text-green" />
          <div
            class="bg-white rounded-full w-5 h-5 border-2 border-gray-200 transition-300"
            :class="address.home ? 'border-orange border-[5px]' : ''"
          ></div>
        </div>
        <h3 class="mt-3 text-dark font-bold">{{ $t('home') }}</h3>
        <p class="line-clamp-1 text-xs text-gray-100 mt-1">
          ул. Адхама Рахмата, 15, Ташкент
        </p>
      </div>
      <div
        :class="address.work ? 'border-orange' : ''"
        class="bg-gray-300 p-3 rounded-xl w-full cursor-pointer group border border-transparent hover:border-orange transition-300"
        @click="handleAddress"
      >
        <div class="flex-center-between">
          <IconBuilding class="text-2xl text-green" />
          <div
            class="bg-white rounded-full w-5 h-5 border-2 border-gray-200 transition-300"
            :class="address.work ? 'border-orange border-[5px]' : ''"
          ></div>
        </div>
        <h3 class="mt-3 text-dark font-bold">{{ $t('home') }}</h3>
        <p class="line-clamp-1 text-xs text-gray-100 mt-1">
          ул. Адхама Рахмата, 15, Ташкент
        </p>
      </div>
    </div>
    <BaseButton
      class="mt-6 w-full group"
      :loading="false"
      :text="$t('other_address')"
      variant="secondary"
    >
      <template #suffix>
        <IconChevron
          class="text-2xl text-dark group-hover:text-orange transition-300 transform rotate-180 group-hover:translate-x-1"
        />
      </template>
    </BaseButton>
    <BaseButton
      class="mt-4 w-full group"
      :loading="false"
      :text="$t('confirm')"
      variant="primary"
    >
    </BaseButton>
  </BaseModal>
</template>

<script setup lang="ts">
import IconBuilding from '~/assets/icons/Common/building.svg'
import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconHouse from '~/assets/icons/Common/house.svg'

interface Props {
  show?: boolean
}

const address = reactive({
  home: true,
  work: false,
})

const handleAddress = () => {
  address.home = !address.home
  address.work = !address.work
}

defineProps<Props>()
</script>
