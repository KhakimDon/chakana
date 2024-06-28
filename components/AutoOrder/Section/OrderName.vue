<template>
  <PaymentCardInfo
    icon="SvgoCommonEdit"
    icon-class="text-purple-500 !text-2xl"
    :title="$t('auto_order_title')"
    :subtitle="defaultInfo?.name"
    text-wrapper-class="!border-gray-200"
    @open-details="showEdit = true"
  />
  <OrderInfoEditName
    v-model="showEdit"
    :default-info="defaultInfo"
    @save="$emit('save', $event)"
  />
</template>

<script setup lang="ts">
import { useCartOrderStore } from '~/store/cart_order.js'
import { useModalStore } from '~/store/modal.js'

interface Props {
  defaultInfo?: any
}
defineProps<Props>()

defineEmits<{
  (e: 'save', value: any): void
}>()

const showEdit = ref(false)

const orderCartStore = useCartOrderStore()
</script>
