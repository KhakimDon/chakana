<template>
  <main>
    <LayoutWrapper v-if="useMobile('desktop')">
      <CartFull>
        <CartSectionProducts />
      </CartFull>
      <template #right>
        <CartCardRight />
      </template>
    </LayoutWrapper>
    <LayoutMobile v-else>
      <section class="mt-[85px] mb-24 space-y-6">
        <CartFull />
        <CartCardRight />
        <CartSectionProducts />
      </section>
    </LayoutMobile>
  </main>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cart.js'

const cartStore = useCartStore()

cartStore.getCartProducts()
</script>

<style scoped></style>
