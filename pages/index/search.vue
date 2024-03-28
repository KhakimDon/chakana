<template>
  <div>
    <div class="w-full flex-y-center gap-2">
      <NuxtLink to="/" class="group">
        <IconChevron
          class="text-2xl text-dark group-hover:text-orange transition-300"
        />
      </NuxtLink>
      <NuxtLink to="/search" class="w-full">
        <FormInputSearch
          v-model="search"
          input-id="main-search"
          :placeholder="$t('search')"
          class="w-full !h-10"
        />
      </NuxtLink>
      <button
        class="w-10 h-10 rounded-lg bg-white-100 flex-center shrink-0 hover:bg-[#4DAAF81F] transition-300"
      >
        <IconList class="text-2xl text-[#4DAAF8]" />
      </button>
    </div>

    <div class="flex-y-center gap-1.5 flex-wrap my-4">
      <SearchBadge title="Подгузники Huggies 5" />
    </div>

    <CommonSectionWrapper title="search_history" header-class="!mb-3">
      <template #action>
        <button
          class="text-sm text-orange font-medium leading-normal tracking-[0.15px] hover:underline"
        >
          {{ $t('clear') }}
        </button>
      </template>

      <div class="flex flex-col gap-2">
        <SearchHistory
          v-for="key in 3"
          :key
          title="Рис кругло зёрный Из Холодильника"
          @click="search = 'Рис кругло зёрный Из Холодильника'"
        />
      </div>
    </CommonSectionWrapper>
  </div>
</template>
<script setup lang="ts">
import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconList from '~/assets/icons/Common/list.svg'

const search = ref('')

function focusInput() {
  const input = document.getElementById('main-search') as HTMLInputElement
  input.focus()
}

onMounted(() => {
  focusInput()
})
</script>
