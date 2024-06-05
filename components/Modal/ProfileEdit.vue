<template>
  <BaseModal
    :title="$t('edit_info')"
    v-bind="{ modelValue }"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <FormAvatarUpload :default-image="user?.avatar" class="mb-6" />
    <div class="flex flex-col gap-4">
      <FormGroup :label="$t('full_name')">
        <FormInput
          v-model="form.values.name"
          :placeholder="$t('enter_full_name')"
        />
      </FormGroup>
      <FormGroup :label="$t('phone_number')">
        <FormInput class="pr-2.5" :model-value="'+998 99 883-03-03'" disabled>
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
        <FormInput class="pr-2.5" :model-value="'m.muratov@info.com'" disabled>
          <template #suffix>
            <button>
              <SvgoCommonEditPenSquare
                class="text-2xl leading-6 text-gray-100 hover:text-orange transition-300"
              />
            </button>
          </template>
        </FormInput>
      </FormGroup>
      <FormInput
        v-model="form.values.instagram"
        :placeholder="$t('add_instagram')"
        class="p-1.5 pr-3"
        input-class="!p-0"
      >
        <template #prefix>
          <div
            class="shrink-0 w-[30px] h-[30px] flex-center bg-orange/10 rounded-lg mr-2"
          >
            <img
              src="/images/svg/socials/instagram-gradient.svg"
              alt="Instagram"
            />
          </div>
        </template>
      </FormInput>
      <FormInput
        v-model="form.values.telegram"
        :placeholder="$t('add_telegram')"
        class="p-1.5 pr-3"
        input-class="!p-0"
      >
        <template #prefix>
          <div
            class="shrink-0 w-[30px] h-[30px] flex-center bg-orange/10 rounded-lg mr-2"
          >
            <img
              src="/images/svg/socials/telegram-gradient.svg"
              alt="Instagram"
            />
          </div>
        </template>
      </FormInput>
      <BaseButton :text="$t('save')" class="mt-2" />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { required, url } from '@vuelidate/validators'

import { useAuthStore } from '~/store/auth.js'

interface Props {
  modelValue: boolean
}
defineProps<Props>()

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}
const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const form = useForm(
  {
    name: user.value?.name,
    email: user.value?.email,
    telegram: user.value?.telegram,
    instagram: user.value?.instagram,
  },
  {
    name: { required },
    email: { required },
    telegram: { url },
    instagram: { url },
  }
)
</script>
