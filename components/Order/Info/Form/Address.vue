<template>
  <div>
    <CartCardAddress
      :list
      :loading
      @handle-address="handleAddress"
      @add="showAddModal = true"
    />
    <BaseButton
      class="mt-6 w-full group !py-2.5"
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
}
const props = defineProps<Props>()

interface Emits {
  (e: 'open-map-modal', v: boolean): void
  (e: 'handle-address', v: object): void
}
defineEmits<Emits>()

const { values } = unref(props.form)

const handleAddress = (item: any) => {
  values.id = item.id
  values.address_info = item
}

const { list, resetList, loading } = useListFetcher('/saved/address')

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
