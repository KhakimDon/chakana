<template>
  <BaseModal
    :model-value="modelValue"
    :title="selectedList?.main_name ? $t('edit_list') : $t('new_list')"
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
          {{
            dayjs(
              form.values?.created_at ? form.values?.created_at : new Date()
            ).format('DD.MM.YYYY, HH:mm')
          }}
        </span>
      </p>
      <div class="mb-3">
        <div
          v-if="!showEditor"
          class="text-sm font-normal text-dark leading-tight"
        >
          <p @click="openEditor">
            {{ t('search_list_enter_notes') }}
          </p>
          <BaseButton
            class="text-sm font-normal py-2 px-16 group w-full my-3 text-dark leading-tight"
            :text="$t('paste_text_from_buffer')"
            size="sm"
            variant="secondary"
            @click="pasteClipboardData"
          >
            <template #prefix>
              <SvgoCommonCopy
                class="text-dark text-xl transition-300 group-hover:text-orange"
              />
            </template>
          </BaseButton>
        </div>
        <CommonCheckSpelling
          v-show="showEditor"
          v-model="form.values.notes"
          :model-value="clipboardData"
          class="max-h-96 overflow-y-auto"
          @paste="pasteClipboardData"
        />
      </div>
      <div class="flex-y-center gap-2">
        <BaseButton
          v-if="hasSave"
          class="!py-3 w-full"
          :loading
          variant="secondary"
          :text="$t('save')"
          size="md"
          :disabled="loading || form.$v.value.$invalid"
          @click="add"
        />
        <BaseButton
          class="!py-3 w-full"
          :loading
          :text="$t('search')"
          size="md"
          :disabled="loading || form.$v.value.$invalid"
          @click="add('search')"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'
import dayjs from 'dayjs'

import { useListStore } from '~/store/list.js'

interface Props {
  modelValue: boolean
  selectedList: any
  hasSave?: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t, locale } = useI18n()

const listStore = useListStore()
const loading = ref(false)
const showEditor = ref(false)

const clipboardData = ref()

const pasteClipboardData = () => {
  navigator.clipboard.readText().then((data) => {
    clipboardData.value = [
      ...form.values.notes,
      ...(data?.replaceAll('* ', '')?.split('\n') ?? []),
    ]
    showEditor.value = true
  })
}

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

function createCard(mode?: string) {
  useApi()
    .$post('/create-user-products-list', {
      body: {
        main_name: form.values.main_name,
        notes: form.values.notes,
      },
    })
    .then(() => {
      form.$v.value.$reset()
      form.values.created_at = new Date()
      form.values.main_name = ''
      form.values.notes = []
      emit('update:modelValue', false)
      listStore.getUserProductsList()
      if (mode === 'search') {
        navigateTo(`/${locale.value}/search/list-results`)
      }
    })
    .catch((err: Error) => {
      const { handleError } = useErrorHandling()
      handleError(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function updateCard(mode?: string) {
  useApi()
    .$put('/update-user-products-list', {
      body: {
        main_list_name: form.values.main_name,
        main_list_id: props.selectedList?.main_note_id,
        notes: form.values.notes,
      },
    })
    .then(() => {
      form.$v.value.$reset()
      form.values.created_at = new Date()
      form.values.main_name = ''
      form.values.notes = []
      emit('update:modelValue', false)
      listStore.getUserProductsList()
      if (mode === 'search') {
        navigateTo(`/${locale.value}/search/list-results`)
      }
    })
    .catch((err: Error) => {
      const { handleError } = useErrorHandling()
      handleError(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function add(mode?: string) {
  form.$v.value.$touch()
  if (!form.$v.value.$invalid) {
    loading.value = true
    if (props.selectedList?.main_note_id) {
      updateCard(mode)
    } else {
      createCard(mode)
    }
  }
}

const openEditor = () => {
  showEditor.value = true
  clipboardData.value = ['']
}

watch(
  () => props.selectedList,
  (val) => {
    if (val?.created_at && val?.main_name && val?.notes.length) {
      showEditor.value = true
      form.values.created_at = val?.created_at
      form.values.main_name = val?.main_name
      clipboardData.value = JSON.parse(JSON.stringify(val?.notes))
    } else {
      listStore.selectedList = null
      form.values.created_at = new Date()
      form.values.main_name = ''
      clipboardData.value = ['']
      showEditor.value = false
    }
  }
)
</script>
