<template>
  <div
    class="px-3 py-2.5 md:p-3 bg-[linear-gradient(93deg,_#13B541_-3.28%,_#0F8630_67.71%)] rounded-xl relative after:border-[1.5px] after:border-white/15 after:pointer-events-none after:absolute after:inset-0 after:rounded-xl"
  >
    <div
      class="flex flex-col max-md:flex-row max-md:gap-2.5 max-md:items-center"
    >
      <SvgoProfileWallet class="text-[32px] leading-8 text-white" />
      <div>
        <p
          class="text-[10px] md:text-xs font-normal leading-120 text-white/80 mb-0.5 md:mt-2"
        >
          {{ $t('your_balance') }}
        </p>
        <div class="flex items-end gap-1">
          <p
            class="text-base md:text-lg font-semibold md:font-bold !leading-5 text-white"
          >
            {{ formatMoneyDecimal(balance) }}
          </p>
          <p class="text-xs leading-120 font-medium text-white">UZS</p>
        </div>
      </div>
    </div>
    <div v-if="useMobile('desktop')" class="h-px bg-white/20 w-full mt-3"></div>
    <BaseButton
      class="md:w-full mt-3"
      variant="transparent"
      :text="$t('fill_balance')"
      @click="fillBalanceModal = true"
    />
    <span
      class="w-[104px] h-[104px] bg-white/10 rounded-full flex-center absolute -top-6 -right-[14px] max-md:hidden"
    ></span>
    <img
      class="absolute -top-8 -right-0.5 w-[120px] md:w-[146px] h-[120px] md:h-[146px]"
      src="/images/wallet.webp"
      alt=""
    />
    <!--    <CommonModalPaymentMethod model-value />-->
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
