<template>
  <BaseModal
    :has-back="!showAddAddress"
    :model-value="modelValue"
    :title="defaultAddress ? $t('edit') : $t('specify_your_delivery_address')"
    body-class="!max-w-[868px] !w-full"
    disable-outer-close
    @back="emit('update:model-value', false)"
    @update:model-value="emit('update:model-value', $event)"
  >
    <div v-if="!showAddAddress">
      <p class="text-dark-100 text-sm font-medium leading-140">
        {{ $t('map_modal_desc') }}
      </p>
      <div class="flex mt-4 gap-x-4 gap-y-2">
        <div class="relative w-full">
          <FormInputSearch
            v-model="search"
            :no-clear="false"
            :no-search-icon="false"
            :placeholder="$t('search')"
            @blur="isFocus = false"
            @focus="isFocus = true"
            @search="searchQuery"
          />
          <Transition mode="out-in" name="fade">
            <div
              v-if="openSearchList && searchAddressList.length && isFocus"
              class="bg-white w-full max-h-[400px] absolute rounded-xl shadow-map z-10 overflow-hidden overflow-y-scroll mt-2"
            >
              <ul>
                <li
                  v-for="item in searchAddressList"
                  :key="item.id"
                  class="cursor-pointer"
                >
                  <p
                    class="px-4 py-3 border border-white-100 text-dark text-sm leading-130 font-semibold last:border-b-0 hover:bg-gray-200 transition-300"
                    @click="changeCoords(item)"
                  >
                    {{ item.address }}
                  </p>
                </li>
              </ul>
            </div>
          </Transition>
        </div>
        <BaseButton
          :disabled="!isInTashkent"
          :loading="false"
          :text="$t('confirm')"
          class="shrink-0 !py-2.5 !px-7 !rounded-[10px]"
          variant="primary"
          @click="addAddress"
        />
      </div>
      <div class="rounded-10 overflow-x-auto mt-4">
        <Map
          :zoom="15"
          class="h-[300px] md:h-[440px]"
          @update:center="selectedCoords = $event"
        />
      </div>
    </div>
    <div v-else>
      <div class="relative">
        <AddAddressMap
          :center="selectedCoords"
          :zoom="15"
          class="h-[180px] w-full mt-4 rounded-lg"
          no-actions
          no-controls
          @update:center="selectedCoords = $event"
        />
        <p
          class="bg-white mr-12 flex items-center justify-between shadow-card absolute left-1.5 md:left-2.5 right-1.5 md:right-2.5 bottom-1.5 md:bottom-2.5 text-dark text-sm font-medium px-3 py-2 rounded-[10px]"
        >
          <span class="max-w-[250px] md:max-w-[400px] truncate">
            {{ search }}
          </span>
          <IEditCircle
            class="text-white text-xl cursor-pointer"
            @click="showAddAddress = false"
          />
        </p>
      </div>
      <div class="mt-6 gap-x-4 gap-y-2 grid sm:grid-cols-2">
        <FormGroup :label="$t('select_icon')">
          <FormSelect
            v-model="selectIcons"
            :error="error"
            :options="icons"
            :placeholder="$t('select_icon')"
            head-styles="h-11"
            is-radio
            label-key="title"
            value-key="id"
          />
        </FormGroup>
        <FormGroup :label="$t('name_address')">
          <FormInput v-model="nameAddress" :placeholder="$t('name_address')" />
        </FormGroup>

        <FormGroup :label="$t('apartment')">
          <FormInput
            v-model="addressForm.values.home_number"
            v-maska="'#########'"
            :placeholder="$t('apartment_number')"
            class="px-3"
            input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
            type="number"
          />
        </FormGroup>
        <FormGroup :label="$t('entrance')">
          <FormInput
            v-model="addressForm.values.entrance"
            v-maska="'#########'"
            :placeholder="$t('entrance')"
            class="px-3"
            input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
            type="number"
          />
        </FormGroup>
        <FormGroup :label="$t('floor')">
          <FormInput
            v-model="addressForm.values.floor"
            v-maska="'#########'"
            :placeholder="$t('floor')"
            class="px-3"
            input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
            type="number"
          />
        </FormGroup>
        <FormGroup :label="$t('entrance_code')">
          <FormInput
            v-model="addressForm.values.entrance_code"
            :placeholder="$t('entrance_code')"
            class="px-3"
            input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
          />
        </FormGroup>
      </div>
      <div class="flex items-center gap-4 mt-6">
        <BaseButton
          v-if="!defaultAddress"
          :text="$t('cancel')"
          class="w-full group"
          variant="secondary"
          @click="showAddAddress = false"
        />
        <BaseButton
          v-else
          :loading="deleteLoading"
          :text="$t('delete')"
          class="w-full group"
          variant="secondary"
          @click="showDeleteConfirmModal = true"
        >
          <template #prefix>
            <SvgoCommonTrash class="text-2xl leading-6" />
          </template>
        </BaseButton>
        <BaseButton
          :disabled="!Boolean(addressForm.values?.home_number?.length)"
          :loading="buttonLoading"
          :text="defaultAddress ? $t('save') : $t('add')"
          class="w-full group"
          variant="primary"
          @click="sendAddress"
        />
      </div>
      <DeleteConfirm
        v-model="showDeleteConfirmModal"
        :loading="deleteLoading"
        :title="$t('delete')"
        @do-action="deleteAddress"
      />
    </div>
  </BaseModal>
</template>

<script lang="ts" setup>
import { required } from '@vuelidate/validators'

import IEditCircle from '~/assets/icons/Common/edit-circle.svg'
import DeleteConfirm from '~/components/Common/Modal/DeleteConfirm.vue'
import { useCustomToast } from '~/composables/useCustomToast.js'
import { useAddressStore } from '~/store/address.js'

interface Props {
  modelValue: boolean
  defaultAddress?: any
}

const props = defineProps<Props>()

interface Emits {
  (e: 'open-saved-adress'): void

  (e: 'edited'): void

  (e: 'update:model-value', value: boolean): void
}

const emit = defineEmits<Emits>()

const { t } = useI18n()

const addressStore = useAddressStore()
const { handleError } = useErrorHandling()
const { showToast } = useCustomToast()

const addressForm = useForm(
  {
    floor: props?.defaultAddress?.floor ?? '',
    entrance: props?.defaultAddress?.entrance ?? '',
    home_number: props?.defaultAddress?.home_number ?? '',
    entrance_code: props?.defaultAddress?.entrance_code ?? '',
  },
  {
    home_number: { required },
  }
)

const searchAddressList = computed(() => addressStore.searchAddressList.list)
const addressClick = computed(() => addressStore.addressMap.list)

const buttonLoading = ref<boolean>(false)
const selectedCoords = ref([])
const showAddAddress = ref(false)
const selectIcons = ref<number | string | { [key: string]: string | number }>()
const search = ref<string>(props.defaultAddress?.street)
const isFocus = ref<boolean>(false)
const openSearchList = ref<boolean>(false)
const nameAddress = ref<string>('')
const error = ref<boolean>(false)
const isInTashkent = ref(true)

const { list: icons } = useListFetcher('get/icons', 10, false)

const getAddress = (coords?: any) => {
  addressStore
    .fetchAddress(coords[1], coords[0])
    .then((res) => {
      isInTashkent.value = true
      search.value = res?.street
    })
    .catch((error) => {
      isInTashkent.value = false
      handleError(error)
    })
}

watch(
  () => selectedCoords.value,
  () => {
    console.log('cooords fom watched', selectedCoords.value)
    getAddress(selectedCoords.value)
  },
  { deep: true }
)

const addAddress = () => {
  if (search.value) {
    showAddAddress.value = true
  } else {
    error.value = true
  }
}

const searchQuery = (e: string) => {
  search.value = e
  addressStore.searchAddress(search.value)
  openSearchList.value = true
}

const changeCoords = (item: any) => {
  search.value = item.address
  selectedCoords.value = [item.longitude, item.latitude]
  openSearchList.value = false
}

function sendAddress() {
  if (search.value && selectIcons.value && nameAddress.value) {
    buttonLoading.value = true
    if (props.defaultAddress) {
      editAddress()
    } else {
      saveAddress()
    }
  } else {
    error.value = true
  }
}

watch(
  () => selectIcons.value,
  () => {
    error.value = !search.value
  }
)

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((currentPosition) => {
      selectedCoords.value = [
        currentPosition.coords.longitude,
        currentPosition.coords.latitude,
      ]

      getAddress(selectedCoords.value)
    })
  } else {
    console.log('Geolocation is not supported in this browser')
  }
}

onMounted(() => {
  getCurrentLocation()
})

watch(
  () => props.modelValue,
  (value) => {
    if (value && props.defaultAddress) {
      search.value = props.defaultAddress?.street
      selectIcons.value = props.defaultAddress?.icon_id
      nameAddress.value = props.defaultAddress?.title
      selectedCoords.value = [
        props.defaultAddress?.longitude,
        props.defaultAddress?.latitude,
      ]
      addressForm.values.home_number = props?.defaultAddress?.home_number ?? ''
      addressForm.values.floor = props?.defaultAddress?.floor ?? ''
      addressForm.values.entrance = props?.defaultAddress?.entrance ?? ''
      addressForm.values.entrance_code =
        props?.defaultAddress?.entrace_code ?? ''
      showAddAddress.value = true
    } else {
      showAddAddress.value = false
      search.value = ''
      // selectIcons.value = ''
      nameAddress.value = ''
      getCurrentLocation()
    }
  },
  { immediate: true }
)

function saveAddress() {
  useApi()
    .$post('/saved/address', {
      body: {
        ...addressForm.values,
        icon_id: selectIcons.value,
        title: nameAddress.value,
        street: addressClick.value.street,
        zip: addressClick.value.zip,
        latitude: selectedCoords.value[1],
        longitude: selectedCoords.value[0],
      },
    })
    .then((res: any) => {
      if (res.saved) {
        showToast(t('success_send'), 'success')
        emit('edited')
      }
    })
    .catch((err: any) => {
      handleError(err)
    })
    .finally(() => {
      buttonLoading.value = false
      showAddAddress.value = false
      emit('open-saved-adress')
      emit('update:model-value', false)
    })
}

function editAddress() {
  useApi()
    .$put(`/saved/address/${props.defaultAddress?.id}`, {
      body: {
        ...addressForm.values,
        icon_id: selectIcons.value,
        title: nameAddress.value,
        street: addressClick.value.street,
        zip: addressClick.value.zip.toString(),
        latitude: selectedCoords.value[1],
        longitude: selectedCoords.value[0],
      },
    })
    .then(() => {
      showToast(t('success_edited'), 'success')
      showAddAddress.value = false
      emit('update:model-value', false)
      emit('edited')
    })
    .catch((err: any) => {
      handleError(err)
    })
    .finally(() => {
      buttonLoading.value = false
    })
}

const showDeleteConfirmModal = ref(false)
const deleteLoading = ref(false)

function deleteAddress() {
  deleteLoading.value = true
  useApi()
    .$delete(`/saved/address/${props.defaultAddress?.id}`)
    .then(() => {
      showToast(t('success_deleted'), 'success')
      emit('edited')
      emit('update:model-value', false)
      showDeleteConfirmModal.value = false
    })
    .catch((err: any) => {
      handleError(err)
    })
    .finally(() => {
      deleteLoading.value = false
    })
}
</script>
