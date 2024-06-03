<template>
  <div class="flex flex-col gap-12">
    <FormGroup :label="$t('phone_number')">
      <FormInput
        v-model="form.values.phone"
        v-maska="'## ###-##-##'"
        placeholder="00 000-00-00"
        input-class="!pl-1"
        type="number"
        :error="form.$v.value.phone.$error"
      >
        <template #prefix>
          <div class="flex-center h-11">
            <p
              class="text-base sm:text-sm leading-5 text-dark pl-3 font-medium"
            >
              +998
            </p>
          </div>
        </template>
      </FormInput>
    </FormGroup>

    <div>
      <BaseButton
        variant="secondary"
        class="w-full !text-base h-11 flex-center"
        size="md"
        :text="$t('login_with_qr')"
      >
        <template #prefix>
          <IconQr class="!-mb-px block" />
        </template>
      </BaseButton>

      <BaseButton
        class="w-full mt-4"
        :disabled="form.$v.value.$invalid"
        :text="$t('continue')"
        @click="submit"
      />
      <i18n-t
        keypath="login_policy_text"
        tag="p"
        class="text-xs text-gray-100 leading-140 text-center mt-3"
      >
        <template #terms>
          <a
            href="https://www.google.com"
            target="_blank"
            class="text-blue-100 hover:underline"
          >
            {{ $t('terms') }}
          </a>
        </template>
        <template #privacy>
          <a
            href="https://www.google.com"
            target="_blank"
            class="text-blue-100 hover:underline"
          >
            {{ $t('privacy') }}
          </a>
        </template>
      </i18n-t>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconQr from '~/assets/icons/Common/qr.svg'
import type { TForm } from '~/composables/useForm'

interface Props {
  form: TForm<any>
}

const props = defineProps<Props>()
const emit = defineEmits(['submit'])

const { form } = unref(props)

function submit() {
  form.$v.value.$touch()
  if (!form.$v.value.$invalid) {
    emit('submit')
  }
}
</script>
