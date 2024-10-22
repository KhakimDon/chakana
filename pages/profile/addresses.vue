<script lang="ts" setup>
const { list, resetList, loading } = useListFetcher('/saved/address', 50)

const addAddressModal = ref(false)

const activeAddress = ref()

const showEditAddressModal = (item: any) => {
  activeAddress.value = item
  addAddressModal.value = true
}

const showAddAddressModal = () => {
  addAddressModal.value = true
  activeAddress.value = undefined
}
</script>

<template>
  <div>
    <CommonBack v-if="useMobile('mobile')" to="/profile" />
    <div class="flex-center-between mb-4">
      <h1 class="text-xl font-extrabold leading-7 text-dark">
        {{ $t('addresses') }}
      </h1>
      <button
        class="flex-y-center gap-1 text-red text-sm font-semibold leading-5 transition-300 group hover:text-orange"
        @click="showAddAddressModal"
      >
        <SvgoCommonPlus
          class="text-xl leading-5 text-red transition-300 group-hover:text-orange"
        />
        {{ $t('add_address') }}
      </button>
    </div>
    <Transition mode="out-in" name="fade">
      <div
        :key="loading.list"
        class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <template v-if="loading.list">
          <ProfileAddressCardLoading v-for="index in 12" :key="index" />
        </template>
        <template v-else-if="list?.length">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="bg-gray-300 p-3 rounded-xl w-full cursor-pointer group border border-transparent hover:border-orange transition-300 group"
            @click="showEditAddressModal(item)"
          >
            <div class="flex-center-between">
              <img
                :alt="item?.title"
                :src="item?.icon"
                height="24px"
                width="24px"
              />
              <SvgoCommonEditPenSquare
                class="text-2xl leading-6 text-gray group-hover:text-orange transition-300"
              />
            </div>
            <h3 class="mt-3 text-dark font-bold">{{ item?.title }}</h3>
            <p class="line-clamp-1 text-xs text-gray-100 mt-1">
              {{ item?.street }}
            </p>
          </div>
        </template>
        <template v-else>
          <CommonNoData class="sm:col-span-2 md:col-span-3 lg:col-span-4" />
        </template>
      </div>
    </Transition>
    <client-only>
      <CommonModalMap
        v-model="addAddressModal"
        :default-address="activeAddress"
        @edited="resetList"
      />
    </client-only>
  </div>
</template>
