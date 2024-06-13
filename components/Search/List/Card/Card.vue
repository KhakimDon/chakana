<template>
  <div
    class="h-fit min-h-[211px] w-full md:w-44 p-3 group rounded-10 flex flex-col bg-gray-300"
  >
    <div class="flex-y-center mb-3 justify-between">
      <p
        class="text-base font-semibold text-dark line-clamp-1 leading-tight cursor-pointer transition-300 group-hover:text-orange"
        @click="emit('openDetails')"
      >
        {{ list?.main_name }}
      </p>
      <SvgoCommonTrash
        v-if="showDelete"
        class="text-gray-500 cursor-pointer text-xl hover:text-red transition-300"
        @click="emit('delete', list?.main_note_id)"
      />
    </div>
    <div
      class="overflow-y-auto overflow-x-hidden cursor-pointer h-[100px] transition-300 group-hover:text-orange"
      @click="emit('openDetails')"
    >
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
    </div>
    <div class="mb-4 h-5 relative z-10">
      <span
        v-if="moreCount > 0 && !isMoreClicked"
        class="text-green cursor-pointer flex-y-center w-fit"
        @click="isMoreClicked = !isMoreClicked"
      >
        <span>{{ t('more', { count: moreCount }) }}</span>
        <SvgoCommonChevron
          class="text-green rotate-180 text-xl transition-300"
          :class="isMoreClicked ? 'rotate-90' : 'rotate-180'"
        />
      </span>
    </div>
    <p
      v-if="list?.created_at"
      class="flex-y-center leading-130 cursor-pointer"
      @click="emit('openDetails')"
    >
      <SvgoCommonCalendar class="mr-1 text-xl text-gray" />
      <span
        class="text-dark text-sm font-medium leading-130 transition-300 group-hover:text-orange"
      >
        {{ dayjs(list?.created_at).format('DD.MM.YYYY, HH:mm') }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

interface Props {
  list: {
    main_name: string
    main_note_id: string
    notes: string[]
    created_at: string
  }
  showDelete?: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'openDetails'): void
  (e: 'delete', id?: string): void
}>()

const { t } = useI18n()
const isMoreClicked = ref(false)

const moreCount = computed(() => {
  return props.list?.notes?.length > 5 ? props.list?.notes?.length - 5 : 0
})
</script>

<style scoped></style>
