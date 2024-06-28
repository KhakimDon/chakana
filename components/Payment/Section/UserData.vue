<template>
  <PaymentCardInfo
    icon="SvgoProfileUserCircle"
    icon-class="text-teal-700 !text-2xl"
    :title="userData?.length > 10 ? userData : $t('recipient_details')"
    @open-details="showEdit = true"
  />
  <OrderInfoEditUserInfo
    v-model="showEdit"
    :default-info="user"
    @save="$emit('save', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  full_name: string
  phone: string
}
const props = defineProps<Props>()

interface Emits {
  (e: 'save', data: any): void
}
defineEmits<Emits>()

const showEdit = ref(false)
const user = computed(() => {
  return {
    full_name: props.full_name,
    phone: props.phone,
  }
})

const userData = computed(() => props.full_name + ', +998 ' + props.phone)
</script>

<style scoped></style>
