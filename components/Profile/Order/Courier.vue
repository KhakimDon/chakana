<template>
  <div class="py-3 px-4 bg-gray-300 rounded-xl">
    <p class="mb-2 text-sm leading-140 font-medium text-gray-100">
      {{ $t('courier') }}
    </p>
    <div class="flex sm:items-center gap-3 justify-between max-sm:flex-col">
      <div class="flex items-center gap-3">
        <div class="border border-white-100 rounded-full w-12 h-12">
          <img
            class="w-full h-full rounded-full object-cover shrink-0"
            :src="courier.image"
            :alt="courier.full_name"
          />
        </div>
        <p class="text-sm leading-130 font-bold text-dark">
          {{ courier.full_name }}
        </p>
      </div>
      <div class="flex items-center gap-3 max-sm:flex-col max-sm:w-full">
        <div class="h-px sm:h-9 w-full sm:w-px bg-gray-200"></div>
        <BaseButton
          v-if="!noWrite"
          class="!bg-gray-200 hover:!bg-white max-sm:w-full"
          :text="$t('write_to_courier')"
          variant="secondary"
          @click="messageModal = true"
        >
          <template #prefix>
            <SvgoProfileMessage class="text-xl leading-5" />
          </template>
        </BaseButton>
        <a
          v-if="courier.phone"
          :href="`tel:${courier.phone}`"
          class="max-sm:w-full"
        >
          <BaseButton
            :text="formatPhoneNumber(courier.phone)"
            variant="green"
            class="max-sm:w-full"
          >
            <template #prefix>
              <SvgoCommonPhone class="text-xl leading-5" />
            </template>
          </BaseButton>
        </a>
      </div>
    </div>
    <BaseModal v-model="messageModal" :title="$t('write_to_courier')">
      <FormTextarea
        v-model="form.values.message"
        :error="form.$v.value.message.$error"
        :rows="5"
        :placeholder="$t('enter_text')"
      />
      <BaseButton
        class="mt-4 w-full"
        :loading
        :text="$t('send')"
        @click="submit"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { required } from '@vuelidate/validators'

import { formatPhoneNumber } from '~/utils/functions/common.js'

const messageModal = ref(false)

interface Props {
  orderId: number
  courier: {
    id: number
    full_name: string
    phone: string
    image: string
  }
  noWrite?: boolean
}
defineProps<Props>()

const route = useRoute()
const { t } = useI18n()

const form = useForm(
  {
    message: '',
  },
  {
    message: { required },
  }
)

const loading = ref(false)
function submit() {
  form.$v.value.$touch()
  if (form.$v.value.$invalid) return
  loading.value = true
  useApi()
    .$post(`/send/message/to/courier/${route.params.id}`, { body: form.values })
    .then(() => {
      messageModal.value = false
      useCustomToast().showToast(t('your_message_successfully_sent'), 'success')
    })
    .catch((err) => {
      useErrorHandling().handleError(err)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
