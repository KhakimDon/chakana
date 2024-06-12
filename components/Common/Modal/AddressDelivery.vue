<template>
  <BaseModal
    :model-value="show"
    body-class="!max-w-[424px]"
    :title="$t('address_delivery')"
    disable-outer-close
    @close="$emit('close')"
  >
    <div v-if="list.length">
      <div class="grid grid-cols-2 gap-4 overflow-y-scroll max-h-[230px]">
        <CartCardAdress v-bind="{ list }" @handle-address="handleAddress" />
      </div>
      <BaseButton
        class="mt-6 w-full group"
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
        @click="$emit('handle-address', addressItem)"
      >
      </BaseButton>
    </div>
    <div v-else>
      <NoDataMap />
      <BaseButton
        class="mt-4 w-full group"
        :loading="buttonLoading"
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
import NoDataMap from '~/components/Common/NoData/NoDataMap.vue'

interface Props {
  show: boolean
  list?: any
  buttonLoading?: boolean
}

interface Emits {
  (e: 'close', v: boolean): void
  (e: 'open-map-modal', v: boolean): void
  (e: 'handle-address', v: object): void
}

const $emit = defineEmits<Emits>()
const addressItem = ref(null)

const handleAddress = (item: object) => {
  addressItem.value = item
}

defineProps<Props>()
</script>
