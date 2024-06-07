<template>
  <BaseModal
    :model-value="modelValue"
    :title="$t('courier_comment')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div>
      <p class="text-sm font-medium leading-tight mb-4">
        {{ $t('courier_comment_info') }}
      </p>
      <FormGroup :label="$t('text_comment')" class="mb-6">
        <FormTextarea
          v-model="form.values.comment"
          :error="form.$v.value.comment.$error"
          class="px-3"
          input-class="!pl-2 text-sm font-medium leading-tight h-32"
          :placeholder="$t('enter_comment')"
        />
      </FormGroup>
      <BaseButton
        class="!py-3 w-full"
        :loading
        :text="$t('save')"
        size="md"
        @click="add"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const loading = ref(false)

const form = useForm(
  {
    comment: '',
  },
  {
    comment: { required, minLength: minLength(10) },
  }
)

function add() {
  form.$v.value.$touch()
  if (!form.$v.value.$invalid) {
    loading.value = true
    // API call here
  }
}

watch(
  () => props.modelValue,
  () => {
    form.$v.value.$reset()
  }
)
</script>
