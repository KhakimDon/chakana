<template>
  <div class="flex flex-col gap-y-4">
    <p class="text-sm font-medium leading-tight">
      {{ $t('courier_comment_info') }}
    </p>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <FormGroup :label="$t('apartment')">
        <FormInput
          v-model="values.location_details.home_number"
          v-maska="'#########'"
          :placeholder="$t('apartment_number')"
          class="px-3"
          input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
          type="number"
        />
      </FormGroup>
      <FormGroup :label="$t('entrance')">
        <FormInput
          v-model="values.location_details.entrance"
          v-maska="'#########'"
          :placeholder="$t('entrance')"
          class="px-3"
          input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
          type="number"
        />
      </FormGroup>
      <FormGroup :label="$t('floor')">
        <FormInput
          v-model="values.location_details.floor"
          v-maska="'#########'"
          :placeholder="$t('floor')"
          class="px-3"
          input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
          type="number"
        />
      </FormGroup>
    </div>
    <FormGroup :label="$t('entrance_code')">
      <FormInput
        v-model="values.location_details.entrance_code"
        :placeholder="$t('entrance_code')"
        class="px-3"
        input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
      />
    </FormGroup>
    <FormGroup :label="$t('text_comment')">
      <FormTextarea
        v-model="values.comment_to_courier"
        :placeholder="$t('enter_comment')"
        :rows="3"
        class="px-3"
        input-class="!pl-2 text-base md:text-sm font-medium leading-tight h-32"
      />
    </FormGroup>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  form: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { values, $v } = unref(props.form)
</script>
