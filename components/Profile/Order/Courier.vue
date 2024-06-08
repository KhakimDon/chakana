<script setup lang="ts"></script>

<template>
  <div class="py-3 px-4 bg-gray-300 rounded-xl">
    <p class="mb-2 text-sm leading-140 font-medium text-gray-100">
      {{ $t('courier') }}
    </p>
    <div class="flex items-center gap-3 justify-between">
      <div class="flex items-center gap-3">
        <div class="border border-white-100 rounded-full w-12 h-12">
          <img
            class="w-full h-full rounded-full object-cover shrink-0"
            src="https://picsum.photos/100/100"
            alt=""
          />
        </div>
        <p class="text-sm leading-130 font-bold text-dark">
          Olimjonov Ibroihim
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="h-9 w-px bg-gray-200"></div>
        <BaseButton
          class="!bg-gray-200 hover:!bg-white"
          :text="$t('write_to_courier')"
          variant="secondary"
        >
          <template #prefix>
            <SvgoProfileMessage class="text-xl leading-5" />
          </template>
        </BaseButton>
        <a href="tel:+9989094949391">
          <BaseButton :text="'+9989094949391'" variant="green">
            <template #prefix>
              <SvgoCommonPhone class="text-xl leading-5" />
            </template>
          </BaseButton>
        </a>
      </div>
    </div>
    <BaseModal model-value :title="$t('write_to_courier')"> </BaseModal>
  </div>
</template>

<style scoped></style>
