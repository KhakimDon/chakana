<template>
  <div>
    <p class="text-sm font-medium leading-tight mb-4">
      {{ $t('courier_comment_info') }}
    </p>
    <FormGroup :label="$t('text_comment')">
      <FormTextarea
        v-model="values.comment_to_courier"
        class="px-3"
        input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
        :placeholder="$t('enter_comment')"
        :rows="3"
      />
    </FormGroup>
  </div>
</template>

<script setup lang="ts">
interface Props {
  form: any
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { values, $v } = unref(props.form)
</script>
