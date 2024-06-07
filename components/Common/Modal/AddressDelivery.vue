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
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="addressIdx === index ? '!border-orange' : ''"
          class="bg-gray-300 p-3 rounded-xl w-full cursor-pointer group border border-transparent hover:border-orange transition-300"
          @click="handleAddress(index)"
        >
          <div class="flex-center-between">
            <img :src="item.icon" alt="" width="24px" height="24px" />
            <div
              class="bg-white rounded-full w-5 h-5 border-2 border-gray-200 transition-300"
              :class="addressIdx === index ? 'border-orange border-[5px]' : ''"
            ></div>
          </div>
          <h3 class="mt-3 text-dark font-bold">{{ item.address }}</h3>
          <p class="line-clamp-1 text-xs text-gray-100 mt-1">
            {{ item.street }}
          </p>
        </div>
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
      <!--    ToDo: Primary button ishlamaydi keyinroq ishlatib qo'yaman-->
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
