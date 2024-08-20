<template>
  <BaseModal
    :model-value="true"
    :title="$t('clear_cart')"
    body-class="!w-[424px]"
    @update:model-value="$emit('update:modelValue', false)"
  >
    <div>
      <p class="text-sm leading-140 text-dark whitespace-pre-line">
        {{ $t('online_receipt_text') }}
      </p>

      <div
        class="flex flex-row space-x-2 items-center bg-gray-300 rounded-md p-2 mt-3"
      >
        <span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9991 8.99996V13M11.9991 17H12.0091M10.239 3.95696L1.81704 18.017C1.64352 18.3177 1.55172 18.6585 1.55079 19.0057C1.54985 19.3529 1.63981 19.6943 1.81171 19.9959C1.98361 20.2975 2.23147 20.5489 2.53064 20.7251C2.82982 20.9012 3.16989 20.996 3.51704 21H20.362C20.7092 20.996 21.0493 20.9012 21.3484 20.7251C21.6476 20.5489 21.8955 20.2975 22.0674 19.9959C22.2393 19.6943 22.3292 19.3529 22.3283 19.0057C22.3274 18.6585 22.2356 18.3177 22.062 18.017L13.639 3.95696C13.4617 3.66495 13.2121 3.42355 12.9143 3.25602C12.6166 3.08849 12.2807 3.00049 11.939 3.00049C11.5974 3.00049 11.2615 3.08849 10.9637 3.25602C10.666 3.42355 10.4164 3.66495 10.239 3.95696Z"
              stroke="#FF831B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <p class="text-xs text-dark font-semibold">
          {{ $t('online_receipt_warning') }}
        </p>
      </div>

      <BaseButton
        class="!py-3 !rounded-[10px] w-full mt-5 gradient-background !border-0 !text-base !font-semibold hover:!opacity-90"
        :text="$t('are_you_sure')"
        size="md"
        @click="$emit('update:modelValue', false)"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(180deg, #ff831b 0%, #f30 100%);
}
</style>
