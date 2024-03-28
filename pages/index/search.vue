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
  </div>
</template>
<script setup lang="ts">
import IconChevron from '~/assets/icons/Common/chevron.svg'
import IconList from '~/assets/icons/Common/list.svg'

function focusInput() {
  const input = document.getElementById('main-search') as HTMLInputElement
  input.focus()
}

onMounted(() => {
  focusInput()
})
</script>
