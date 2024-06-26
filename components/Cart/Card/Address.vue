<template>
  <Transition name="fade" mode="out-in">
    <div
      :key="loading.list"
      class="grid grid-cols-2 gap-4 overflow-y-scroll max-h-[60vh]"
    >
      <template v-if="loading.list">
        <ProfileAddressCardLoading v-for="key in 4" :key />
      </template>
      <template v-else-if="list.length">
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="{ '!border-orange': addressIdx === index }"
          class="bg-gray-300 p-3 rounded-xl w-full cursor-pointer group border border-transparent hover:border-orange transition-300"
          @click="handleAddress(item, index)"
        >
          <div class="flex-center-between">
            <img :src="item.icon" alt="" width="24px" height="24px" />
            <div
              class="bg-white rounded-full w-5 h-5 border-2 border-gray-200 transition-300"
              :class="{ 'border-orange border-[5px]': addressIdx === index }"
            ></div>
          </div>
          <h3 class="mt-3 text-dark font-bold line-clamp-1">
            {{ item.icon_title }}
          </h3>
          <p class="line-clamp-1 text-xs text-gray-100 mt-1">
            {{ item.street }}
          </p>
        </div>
      </template>
      <template v-else>
        <CommonNoDataMap />
        <BaseButton
          class="mt-4 w-full group"
          :text="$t('add_address')"
          variant="primary"
          @click="emit('add')"
        >
          <template #prefix>
            <SvgoCommonPlus
              class="text-2xl text-white group-hover:rotate-90 transition-300"
            />
          </template>
        </BaseButton>
      </template>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  list: any[]
  loading: {
    list: boolean
    button: boolean
  }
}

defineProps<Props>()

interface Emits {
  (e: 'handleAddress', v: object): void
  (e: 'add', v: object): void
}
const emit = defineEmits<Emits>()

const addressIdx = ref(0)

const handleAddress = (item: object, index: number) => {
  emit('handleAddress', item)
  addressIdx.value = index
}
</script>
