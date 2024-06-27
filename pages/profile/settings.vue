<template>
  <div>
    <CommonBack v-if="useMobile('mobile')" to="/profile" />
    <h1 class="text-xl font-extrabold leading-7 text-dark mb-4">
      {{ $t('settings') }}
    </h1>
    <div class="flex flex-col gap-3">
      <div
        v-for="(item, index) in listLinks"
        :key="index"
        class="p-3 rounded-[10px] bg-gray-300 flex-center-between border border-transparent transition-300 cursor-pointer"
        :class="item.wrapperClass"
        @click="actions(item.value)"
      >
        <div
          class="flex-y-center gap-2 text-sm font-bold leading-130 text-dark"
        >
          <component
            :is="item.icon"
            class="text-2xl leading-6"
            :class="item.iconClass"
          />
          {{ $t(item.name) }}
        </div>
        <FormToggle
          v-if="item.value === 'notification'"
          class="pointer-events-none"
          :model-value="notification"
        />
        <div
          v-else-if="item.subtitle"
          class="flex-y-center gap-1 text-xs font-medium leading-130 text-gray-100"
        >
          {{ item.subtitle }}
          <SvgoCommonChevron class="text-xl leading-5 text-gray rotate-180" />
        </div>
      </div>
    </div>
    <BaseModal v-model="languageModal" :title="$t('choose_language')">
      <FormRadioGroup
        v-model="language"
        class="-mx-5 -mt-5 mb-3 md:mb-5"
        value-key="code"
        item-class="flex-row-reverse justify-between"
        :items="languagesList"
      >
        <template #label="{ data }">
          <div class="flex-y-center gap-3">
            <img
              width="24"
              height="24"
              :src="`/images/svg/flags/${data.code}.svg`"
              :alt="data.nameFull"
            />
            <p class="text-sm font-bold leading-130 text-dark">
              {{ data.nameFull }}
            </p>
          </div>
        </template>
      </FormRadioGroup>
      <BaseButton class="w-full" :text="$t('confirm')" @click="changeLang" />
    </BaseModal>
    <CommonModalDeleteAccount
      v-model="deleteAccountModal"
      :loading="deletingAccount"
      @do-action="showReasonsFn()"
    />
    <CommonModalReasons
      v-model="showReasons"
      :loading="deletingAccount"
      @do-action="deleteAccountFn"
    />
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/store/auth.js'

const { showToast } = useCustomToast()

const { currentLanguage, languagesList, changeLocale } = useLanguageSwitcher()

const listLinks = ref([
  {
    name: 'language',
    subtitle: currentLanguage.value?.nameFull,
    wrapperClass: 'hover:border-orange hover:bg-orange/10',
    icon: 'SvgoCommonGlobe',
    iconClass: 'text-orange',
    value: 'language',
  },
  {
    name: 'send_notification',
    icon: 'SvgoCommonBell',
    wrapperClass: 'hover:border-[#F7C954] hover:bg-[#F7C954]/10',
    iconClass: 'text-[#F7C954]',
    value: 'notification',
  },
  {
    name: 'delete_account',
    icon: 'SvgoCommonTrash',
    wrapperClass: 'hover:border-red hover:bg-red-500/10',
    iconClass: 'text-red-500',
    value: 'delete_account',
  },
])

const languageModal = ref(false)
const notification = ref(false)
const deleteAccountModal = ref(false)
const language = ref(currentLanguage.value?.code)

const actions = (value: string) => {
  switch (value) {
    case 'language':
      languageModal.value = true
      break
    case 'notification':
      notification.value = !notification.value
      break
    case 'delete_account':
      deleteAccountModal.value = true
      break
  }
}

function changeLang() {
  changeLocale(language.value)
  languageModal.value = false
}

const showReasons = ref(false)

const showReasonsFn = () => {
  showReasons.value = true
  deleteAccountModal.value = false
}

const deletingAccount = ref(false)

const deleteAccountFn = async () => {
  deletingAccount.value = true
  await useAuthStore()
    .deleteAccount()
    .then(() => {
      useAuthStore().logOut()
      deleteAccountModal.value = false
      window.location.reload()
    })
    .catch((error) => {
      showToast(error._data?.detail?.code, 'error')
    })
    .finally(() => {
      deletingAccount.value = false
    })
}
</script>
