<template>
  <div>
    <CartCardAddress
      :key="addressDefaultId"
      :list
      :loading
      :default-id="addressDefaultId"
      @handle-address="handleAddress"
      @add="showAddModal = true"
    />
    <BaseButton
      class="mt-3 md:mt-6 w-full group !py-2.5"
      :text="$t('other_address')"
      variant="secondary"
      @click="showAddModal = true"
    >
      <template #suffix>
        <SvgoCommonChevron
          class="text-2xl text-dark group-hover:text-orange transition-300 transform rotate-180 group-hover:translate-x-1"
        />
      </template>
    </BaseButton>

    <CommonModalMap
      v-model="showAddModal"
      @open-saved-adress="openSavedAddress"
    />
  </div>
</template>
<script setup lang="ts">
interface Props {
  form: any
  defaultId?: string
}
const props = defineProps<Props>()

interface Emits {
  (e: 'open-map-modal', v: boolean): void
  (e: 'handle-address', v: object): void
  (e: 'change-address', v: object): void
}
const emit = defineEmits<Emits>()

const { values } = unref(props.form)

const handleAddress = (item: any) => {
  values.id = item.id
  values.address_info = item
  emit('change-address', item)
}

const { list, resetList, loading } = useListFetcher('/saved/address')

const addressDefaultId = computed(() => {
  return props.defaultId || list.value?.[0]?.id
})

watch(
  () => list.value,
  (val) => {
    if (val?.length) {
      values.id = val[0].id
      values.address_info = val.find((item) => item.id === values.id)
    }
  }
)

const showAddModal = ref(false)

function openSavedAddress() {
  resetList()
}
</script>
