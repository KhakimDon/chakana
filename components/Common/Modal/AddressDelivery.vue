<template>
  <BaseModal
    :model-value="show"
    body-class="!max-w-[484px]"
    :title="$t('address_delivery')"
    disable-outer-close
    :has-back="$route?.query?.order === 'auto'"
    @close="$emit('close')"
    @back="goToName"
  >
    <BaseStepper
      v-if="isCartRoute"
      :steps="$route?.query?.order === 'auto' ? autoOrderSteps : orderSteps"
      :step
      step-class="!w-full"
      class="!mb-5"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import { autoOrderSteps, orderSteps } from '~/data/stepper.js'
import { useModalStore } from '~/store/modal.js'

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

const route = useRoute()
const { locale } = useI18n()

const isCartRoute = computed(() => {
  return (
    route.path === `/${locale.value}/cart` ||
    route.path === `/${locale.value}/cart/`
  )
})

const modalStore = useModalStore()
const step = ref('address')

const goToName = () => {
  modalStore.addressModel = false
  modalStore.autoOrderModel.name = true
}

defineProps<Props>()
</script>
