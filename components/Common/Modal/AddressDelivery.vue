<template>
  <BaseModal
    v-bind="{ show }"
    body-class="!max-w-[424px]"
    :title="$t('address_delivery')"
    disable-outer-close
    @close="$emit('close')"
  >
    <div v-if="list.length">
      <div class="flex items-center gap-4">
        <CartCardAdress v-bind="{ list }" />
      </div>
      <BaseButton
        class="mt-6 w-full group"
        :loading="false"
        :text="$t('other_address')"
        variant="secondary"
        @click="$emit('openMapModal')"
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
        @click="$emit('close')"
      >
      </BaseButton>
    </div>
    <div v-else>
      <div class="mx-auto flex-center mt-[45px]">
        <img src="/images/svg/nodatamap.svg" alt="NodataMap" />
      </div>
      <p class="text-center text-dark font-semibold leading-130 mt-3 mb-[45px]">
        {{ $t('no_address') }}
      </p>
      <BaseButton
        class="mt-4 w-full group"
        :loading="false"
        :text="$t('add_address')"
        variant="primary"
        @click="$emit('openMapModal')"
      >
        <template #prefix>
          <IconPlus
            class="text-2xl text-white group-hover:rotate-90 transition-300"
          />
        </template>
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconPlus from '~/assets/icons/Common/plus.svg'

interface Props {
  show?: boolean
  list?: any
}

const addressIdx = ref(0)

const handleAddress = (index: number) => {
  addressIdx.value = index
}

defineProps<Props>()
</script>
