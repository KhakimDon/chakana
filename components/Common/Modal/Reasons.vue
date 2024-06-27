<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('delete_account')"
    body-class="!w-[424px]"
    @update:model-value="$emit('update:modelValue', false)"
  >
    <div class="min-h-[300px] flex flex-col justify-between">
      <div>
        <p
          class="text-xl font-semibold leading-tight text-dark whitespace-pre-line"
        >
          {{ $t('delete_reason_title') }}
        </p>
        <p class="text-sm leading-140 text-dark whitespace-pre-line">
          {{ $t('delete_reason_subtitle') }}
        </p>

        <FormCheckboxNested
          v-if="reasons?.length"
          v-model="checkbox"
          not-all
          :list="reasons"
          parent-text="All"
          class="my-3 overflow-y-auto"
        />
        <FormCheckbox
          :value="showOtherReason"
          :checked="showOtherReason"
          :label="$t('other_reason')"
          @update:model-value="showOtherReason = $event"
        />

        <Transition name="fade" mode="out-in">
          <div v-if="showOtherReason" class="mt-3">
            <FormTextarea
              v-model="form.values.otherReason"
              class="mt-3"
              :error="form.$v.value.$invalid"
            />
          </div>
        </Transition>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-6">
        <BaseButton
          class="!py-3 !rounded-[10px]"
          :text="$t('cancel')"
          size="md"
          variant="secondary"
          @click="$emit('update:modelValue', false)"
        />
        <BaseButton
          class="!py-3 !rounded-[10px]"
          :text="$t('delete')"
          size="md"
          :loading="loading || sendingReason"
          @click="sendReason"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { required } from '@vuelidate/validators'

import { useAuthStore } from '~/store/auth.js'

interface Props {
  modelValue: boolean
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'doAction'): void
  (e: 'update:modelValue', value: boolean): void
}>()

const showOtherReason = ref(false)
const checkbox = ref([])
const authStore = useAuthStore()

const form = useForm(
  {
    otherReason: '',
  },
  {
    otherReason: {
      required,
    },
  }
)

const reasons = computed(() =>
  authStore.reasons?.map((reason) => {
    return {
      name: reason.title,
      id: reason.id,
    }
  })
)

authStore.getDeleteAccountReasons()

const sendingReason = ref(false)

const callToReason = async () => {
  await authStore
    .sendReason({
      ids: checkbox.value,
      text: form.values.otherReason,
    })
    .then(() => {
      emit('doAction')
      emit('update:modelValue', false)
    })
    .finally(() => {
      sendingReason.value = false
      form.$v.value.$reset()
      showOtherReason.value = false
      checkbox.value = []
    })
}

const sendReason = async () => {
  sendingReason.value = true
  if (!checkbox.value?.length && showOtherReason.value) {
    form.$v.value.$touch()
    if (!form.$v.value.$invalid) {
      await callToReason()
    }
  } else if (checkbox.value?.length) {
    await callToReason()
  }
}
</script>

<style scoped></style>
