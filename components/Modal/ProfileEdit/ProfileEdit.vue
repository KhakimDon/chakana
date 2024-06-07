<template>
  <BaseModal
    :title="$t('edit_info')"
    disable-outer-close
    v-bind="{ modelValue }"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <FormAvatarUpload
      :default-image="user?.image"
      class="mb-6"
      @change="changeAvatar"
    />
    <div class="flex flex-col gap-4">
      <FormGroup :label="$t('full_name')">
        <FormInput
          v-model="form.values.name"
          :placeholder="$t('enter_full_name')"
          :error="form.$v.value.name.$error"
        />
      </FormGroup>
      <FormGroup :label="$t('phone_number')">
        <FormInput
          class="pr-2.5"
          :model-value="formatPhoneNumber(user?.phone)"
          disabled
        >
          <template #suffix>
            <button>
              <SvgoCommonEditPenSquare
                class="text-2xl leading-6 text-gray-100 hover:text-orange transition-300"
              />
            </button>
          </template>
        </FormInput>
      </FormGroup>
      <FormGroup v-model="form.values.email" :label="$t('email')">
        <FormInput
          v-model="form.values.email"
          :error="form.$v.value.email.$error"
          class="pr-2.5"
        />
      </FormGroup>
      <FormInput
        v-model="form.values.instagram"
        placeholder="username"
        class="p-1.5 pr-3"
        input-class="!p-0"
      >
        <template #prefix>
          <div class="flex items-center">
            <div
              class="shrink-0 w-[30px] h-[30px] flex-center bg-orange/10 rounded-lg mr-2"
            >
              <img
                src="/images/svg/socials/instagram-gradient.svg"
                alt="Instagram"
              />
            </div>
            <p
              class="text-base font-medium sm:text-sm text-dark whitespace-nowrap"
            >
              https://instagram.com/
            </p>
          </div>
        </template>
      </FormInput>
      <FormInput
        v-model="form.values.telegram"
        placeholder="username"
        class="p-1.5 pr-3"
        input-class="!p-0"
      >
        <template #prefix>
          <div class="flex items-center">
            <div
              class="shrink-0 w-[30px] h-[30px] flex-center bg-orange/10 rounded-lg mr-2"
            >
              <img
                src="/images/svg/socials/telegram-gradient.svg"
                alt="Instagram"
              />
            </div>
            <p
              class="text-base font-medium sm:text-sm text-dark whitespace-nowrap"
            >
              https://t.me/
            </p>
          </div>
        </template>
      </FormInput>
      <BaseButton :text="$t('save')" class="mt-2" @click="submit" />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { email, required, url } from '@vuelidate/validators'

import { useAuthStore } from '~/store/auth.js'
import type { IUser } from '~/types/auth.js'
import { formatPhoneNumber } from '~/utils/functions/common.js'

interface Props {
  modelValue: boolean
  user: IUser
}
const props = defineProps<Props>()

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}
const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const { showToast } = useCustomToast()
const { t } = useI18n()

const form = useForm(
  {
    name: props.user?.name,
    email: props.user?.email,
    telegram: props.user?.telegram,
    instagram: props.user?.instagram,
  },
  {
    name: { required },
    email: { email },
  }
)

const avatar = ref<File>()
const loading = ref(false)

function changeAvatar(file: File | null) {
  avatar.value = file
}

async function submit() {
  form.$v.value.$touch()
  if (form.$v.value.$invalid) return
  loading.value = true
  console.log(avatar.value)
  if (avatar.value) {
    const imageFormData = new FormData()
    imageFormData.append('image', avatar.value)
    await useApi().$post('upload/avatar', { body: imageFormData })
  } else if (avatar.value === null) {
    await useApi().$delete('delete/avatar')
  }
  authStore
    .updateUser(form.values)
    .then(() => {
      showToast(t('profile_updated_successfully'), 'success')
    })
    .finally(() => {
      loading.value = false
    })
  emit('update:modelValue', false)
}
</script>
