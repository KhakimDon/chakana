<template>
  <div
    class="p-3 bg-[linear-gradient(93deg,_#13B541_-3.28%,_#0F8630_67.71%)] rounded-xl relative after:border-[1.5px] after:border-white/15 after:pointer-events-none after:absolute after:inset-0 after:rounded-xl"
  >
    <SvgoProfileWallet class="text-[32px] leading-8 text-white" />
    <p class="text-xs font-normal leading-120 text-white mb-0.5 mt-2">
      {{ $t('your_balance') }}
    </p>
    <div class="flex items-end gap-1">
      <p class="text-lg font-bold leading-5 text-white">
        {{ formatMoneyDecimal(balance) }}
      </p>
      <p class="text-xs leading-120 font-medium text-white">UZS</p>
    </div>
    <div class="h-px bg-white/20 w-full my-3"></div>
    <BaseButton
      class="w-full"
      variant="transparent"
      :text="$t('fill_balance')"
      @click="fillBalanceModal = true"
    />
    <span
      class="w-[104px] h-[104px] bg-white/10 rounded-full flex-center absolute -top-6 -right-[14px]"
    ></span>
    <img
      class="absolute -top-8 -right-[14px]"
      width="146"
      height="146"
      src="/images/wallet.webp"
      alt=""
    />
    <!--    <ModalPaymentMethod model-value />-->
    <ProfileModalFillBalance v-model="fillBalanceModal" />
  </div>
</template>

<script setup lang="ts">
import { useBalanceStore } from '~/store/profile/balance.js'
import { formatMoneyDecimal } from '~/utils/functions/common'

const balanceStore = useBalanceStore()
const balance = computed(() => balanceStore.balance)
await useAsyncData('balance', () => balanceStore.fetchBalance())

const fillBalanceModal = ref(false)
</script>
