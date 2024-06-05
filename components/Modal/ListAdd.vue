<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('new_list')"
    title-class="!text-xl !font-extrabold !leading-7"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div>
      <FormInput
        v-model="form.values.main_name"
        :placeholder="$t('enter_list_title')"
        :error="form.$v.value.main_name.$error"
        is-transparent
        no-border
        input-class="!pl-0 !text-2xl !font-bold !leading-130"
      />
      <p class="flex-y-center leading-130 mb-4 mt-2">
        <SvgoCommonCalendar class="mr-1 text-xl text-gray" />
        <span class="text-dark text-sm font-medium leading-130">
          {{ dayjs(new Date()).format('DD.MM.YYYY, HH:mm') }}
        </span>
      </p>
      <div class="mb-3">
        <p
          v-if="!showEditor"
          class="text-sm font-normal text-dark leading-tight"
          @click="showEditor = true"
        >
          {{ t('search_list_enter_notes') }}
        </p>
        <CommonCheckSpelling
          v-else
          v-model="form.values.notes"
          class="max-h-96 overflow-y-auto"
        />
      </div>
      <BaseButton
        class="!py-3 w-full"
        :loading
        :text="$t('search')"
        size="md"
        :disabled="loading || form.$v.value.$invalid"
        @click="add"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import { useListStore } from '~/store/list.js'

interface Props {
  modelValue: boolean
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()

const listStore = useListStore()
const loading = ref(false)
const showEditor = ref(false)

const form = useForm(
  {
    main_name: '',
    created_at: new Date(),
    notes: [],
  },
  {
    main_name: { required },
    notes: { required, minLength: minLength(1) },
  }
)

function createCard() {
  useApi()
    .$post('/create-user-products-list', {
      body: {
        main_name: form.values.main_name,
        notes: form.values.notes,
      },
    })
    .then((res: any) => {
      form.$v.value.$reset()
      form.values.created_at = new Date()
      form.values.main_name = ''
      form.values.notes = []
      emit('update:modelValue', false)
      listStore.getUserProductsList()
    })
    .catch((err: Error) => {
      const { handleError } = useErrorHandling()
      handleError(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function add() {
  form.$v.value.$touch()
  if (!form.$v.value.$invalid) {
    loading.value = true
    createCard()
  }
}
</script>
