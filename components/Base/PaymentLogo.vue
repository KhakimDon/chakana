<template>
  <Transition name="fade-fast" mode="out-in">
    <img :key="image" width="24" height="24" :src="image" alt="payment" />
  </Transition>
</template>

<script lang="ts" setup>
const paymentSystems = {
  '8600': 'uzcard',
  '9860': 'humo',
  '5440': 'mastercard',
  '4200': 'visa',
}

interface Props {
  number: string | undefined
  loading?: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const image = computed(() => {
  const paymentSystem: string = String(props.number)
    .split('')
    .slice(0, 4)
    .join('')
  const systems = paymentSystems
  if (!systems[paymentSystem as keyof typeof systems]) {
    return '/images/svg/payments/card.svg'
  } else {
    return `/images/svg/payments/${
      systems[paymentSystem as keyof typeof systems]
    }.svg`
  }
})
</script>
