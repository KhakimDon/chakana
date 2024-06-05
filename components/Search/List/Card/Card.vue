<template>
  <div
    class="h-fit min-h-[211px] w-44 p-3 rounded-10 flex flex-col bg-gray-300"
  >
    <p class="text-base font-semibold mb-3 text-dark leading-tight">
      {{ list?.main_name }}
    </p>
    <ul
      class="list-disc ml-5 mb-2"
      :class="isMoreClicked ? 'h-auto' : 'h-[90px]'"
    >
      <li
        v-for="(note, index) in isMoreClicked
          ? list?.notes
          : list?.notes?.slice(0, 5)"
        :key="index"
        class="text-sm font-normal leading-130"
      >
        {{ note }}
      </li>
    </ul>
    <div class="mb-4 h-10">
      <p
        v-if="moreCount > 0 && !isMoreClicked"
        class="text-green cursor-pointer flex-y-center mb-4"
        @click="isMoreClicked = !isMoreClicked"
      >
        <span>{{ t('more', { count: moreCount }) }}</span>
        <SvgoCommonChevron
          class="text-green rotate-180 text-xl transition-300"
          :class="isMoreClicked ? 'rotate-90' : 'rotate-180'"
        />
      </p>
    </div>
    <p v-if="list?.created_at" class="flex-y-center leading-130">
      <SvgoCommonCalendar class="mr-1 text-xl text-gray" />
      <span class="text-dark text-sm font-medium leading-130">
        {{ dayjs(list?.created_at).format('DD.MM.YYYY, HH:mm') }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

interface Props {
  list: any
}
const props = defineProps<Props>()

const { t } = useI18n()
const isMoreClicked = ref(false)

const moreCount = computed(() => {
  return props.list?.notes?.length > 5 ? props.list?.notes?.length - 5 : 0
})
</script>

<style scoped></style>
