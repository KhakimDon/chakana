<template>
  <FormGroup :label="$t('name')">
    <FormInput
      v-model="values.name"
      :error="$v.name.$error"
      :placeholder="$t('enter_auto_order_title')"
    />
  </FormGroup>
</template>

<script setup lang="ts">
interface Props {
  form: any
}
const props = defineProps<Props>()

const { values, $v } = unref(props.form)
</script>
