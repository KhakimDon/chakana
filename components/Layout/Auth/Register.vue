<template>
  <div>
    <div class="flex-center">
      <FormAvatarUpload @change="changeAvatar" />
    </div>

    <FormGroup :label="$t('full_name')" class="mt-5">
      <FormInput
        v-model="form.values.name"
        :placeholder="$t('enter_full_name')"
        :error="form.$v.value.name.$error"
      />
    </FormGroup>

    <FormInput
      class="!bg-white !border-white-100 mt-5 h-[56px] pl-2"
      :placeholder="$t('add_instagram')"
    >
      <template #prefix>
        <div class="w-10 h-10 bg-white-100 flex-center shrink-0 rounded-10">
          <IconInstagram class="text-2xl text-dark" />
        </div>
      </template>
    </FormInput>

    <FormInput
      class="!bg-white !border-white-100 mt-5 h-[56px] pl-2"
      :placeholder="$t('add_telegram')"
    >
      <template #prefix>
        <div class="w-10 h-10 bg-white-100 flex-center shrink-0 rounded-10">
          <IconTelegram class="text-2xl text-dark" />
        </div>
      </template>
    </FormInput>

    <BaseButton
      class="mt-11 w-full"
      :text="$t('register')"
      :disabled="form.$v.value.$invalid"
      :loading="loading"
      @click="submit"
    />
  </div>
</template>

<script setup lang="ts">
import IconInstagram from '~/assets/icons/Socials/instagram.svg'
import IconTelegram from '~/assets/icons/Socials/telegram.svg'
import type { TForm } from '~/composables/useForm'

interface Props {
  form: TForm<any>
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['submit'])
const { form } = unref(props)

function submit() {
  form.$v.value.$touch()
  if (!form.$v.value.$error) {
    emit('submit')
  }
}

function changeAvatar(file: File | null) {
  form.values.avatar = file
}
</script>
