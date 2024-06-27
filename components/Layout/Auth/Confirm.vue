<template>
  <div>
    <p class="text-sm leading-140 text-gray-100">{{ $t('code_sent') }}</p>
    <button
      class="flex-y-center gap-1.5 px-2 py-1 bg-gray-300 border border-white-100 mt-3 rounded-lg transition-300 hover:border-orange mb-5"
      @click="back"
    >
      <p class="text-sm leading-130 font-semibold text-dark">
        {{ phone }}
      </p>
      <IconEditPen class="text-xl text-dark" />
    </button>
    <FormTestOtp
      v-model="form.values.code"
      :error="form.$v.value.code.$error || error"
      class="my-5"
    />
    <!--    <FormOTP-->
    <!--      v-model="form.values.code"-->
    <!--      :error="form.$v.value.code.$error || error"-->
    <!--      class="my-5"-->
    <!--    />-->

    <CommonTimer :seconds-val="120" @resend="$emit('resend')" />

    <BaseButton
      class="mt-10 w-full"
      v-bind="{ loading }"
      :text="$t('confirm')"
      :disabled="form.$v.value.$invalid"
      @click="submit"
    />
  </div>
</template>

<script setup lang="ts">
import IconEditPen from '~/assets/icons/Common/edit-pen-square.svg'
import type { TForm } from '~/composables/useForm'

interface Props {
  phone: string
  form: TForm<any>
  loading?: boolean
  error?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'submit', 'back', 'resend'])

const { form } = unref(props)

function submit() {
  form.$v.value.$touch()
  if (!form.$v.value.$error) {
    emit('submit')
  }
}

function back() {
  form.values.code = ''
  form.$v.value.$reset()
  emit('back')
}
</script>
