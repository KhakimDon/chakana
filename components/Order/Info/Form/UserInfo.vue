<template>
  <div class="space-y-4">
    <FormGroup :label="$t('full_name')">
      <FormInput
        v-model="values.full_name"
        :error="$v.full_name.$error"
        :placeholder="$t('enter_full_name')"
      />
    </FormGroup>
    <FormGroup :label="$t('phone_number')">
      <FormInput
        v-model="values.phone"
        v-maska="'## ###-##-##'"
        placeholder="00 000-00-00"
        input-class="!pl-1"
        type="number"
        :error="$v.phone.$error"
      >
        <template #prefix>
          <div class="flex-center h-11">
            <p
              class="text-base sm:text-sm leading-5 text-dark pl-3 font-medium max-sm:-mb-0.5"
            >
              +998
            </p>
          </div>
        </template>
      </FormInput>
    </FormGroup>
  </div>
</template>
<script setup lang="ts">
interface Props {
  form: any
}
const props = defineProps<Props>()

const { values, $v } = unref(props.form)
</script>
