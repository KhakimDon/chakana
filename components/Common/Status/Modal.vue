<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('status_payment')"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <div class="flex flex-col items-center">
      <img :src="iconStatus" class="mb-4" />
      <p class="text-center text-xl font-extrabold text-dark">
        {{ $t(titleStatus) }}
      </p>
      <p class="text-center text-sm text-gray-100 !leading-140 mt-2">
        {{ descriptionStatus }}
      </p>
      <BaseButton class="w-full mt-8" :text="$t('back_to')" @click="close" />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
interface Props {
  isPaid: boolean
  type: string
  state: string
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:model-value'])
const router = useRouter()

function close() {
  emit('update:model-value')
  if (props.isPaid && props.state === 'done') {
    router.push('/profile/edit')
  } else {
    router.push('/')
  }
}

const iconStatus = computed(() => {
  if (props.isPaid && props.state === 'done') {
    return '/images/status/Success.svg'
  } else {
    return '/images/status/reject.svg'
  }
})

const titleStatus = computed(() => {
  if (props.isPaid && props.state === 'done') {
    if (props.type === 'order') {
      return 'ordered_successfully'
    } else {
      return 'payed_successfully'
    }
  } else {
    return 'reject_payment'
  }
})

const descriptionStatus = computed(() => {
  if (props.isPaid && props.state === 'done') {
    if (props.type === 'order') {
      return 'ordered_successfully_description'
    } else {
      return 'payed_successfully_description'
    }
  } else {
    return 'reject_payment_description'
  }
})
</script>
