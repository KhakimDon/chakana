<template>
  <div class="text-center pt-4 md:pt-8">
    <h1 class="text-xl md:text-2xl font-extrabold leading-130 text-dark mb-1">
      {{ $t('get_your_order') }}
    </h1>
    <p class="text-sm leading-140 text-dark">{{ $t('how_the_order') }}</p>
    <FormRatePicker v-model="star" class="justify-center mt-6" />
    <div class="max-w-[535px] mx-auto">
      <Transition name="fade" mode="out-in">
        <div v-if="loading" class="flex flex-col gap-6 mt-6">
          <div v-for="i in 5" :key="i" class="flex-y-center gap-3">
            <div class="w-6 h-6 shimmer rounded"></div>
            <div class="w-full h-6 shimmer rounded"></div>
          </div>
        </div>
        <FormCheckboxNested
          v-else-if="list.length"
          v-model="reason"
          item-class="!py-3 md:!py-[14px] !border-none"
          class="md:px-3 mt-3 md:mt-6"
          not-all
          :list="nestedList"
        />
      </Transition>
      <CollapseTransition>
        <FormTextarea
          v-if="hasOther"
          v-model="text"
          rows="3"
          class="mt-1"
          :placeholder="$t('enter_comment')"
        />
      </CollapseTransition>
    </div>
    <BaseButton
      :loading="submitLoading"
      class="mt-3 md:mt-5 w-full max-w-[535px]"
      :text="$t('send')"
      @click="submit"
    />
  </div>
</template>

<script setup lang="ts">
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue'

interface Props {
  id: number
}

const props = defineProps<Props>()

const emit = defineEmits(['ranked'])

const { t } = useI18n()

const star = ref(0)
const reason = ref<number[]>()
const text = ref('')

const stars = [
  'one_star',
  'two_stars',
  'three_stars',
  'four_stars',
  'five_stars',
]

const loading = ref(false)
const list = ref<{ title: string; id: number }[]>([])

function fetchReasons() {
  loading.value = true
  useApi()
    .$get<{ title: string; id: number }[]>(
      `/reasons?reason_type=${stars[star.value - 1]}`
    )
    .then((res) => {
      list.value = res
    })
    .finally(() => {
      loading.value = false
    })
}

watch(star, fetchReasons)
const nestedList = computed(() =>
  list.value?.map((item) => ({
    name: item.title,
    id: item.id,
  }))
)

const hasOther = computed(() =>
  reason.value?.includes(list.value?.[list.value.length - 1].id)
)

const submitLoading = ref(false)
function submit() {
  submitLoading.value = true
  useApi()
    .$post('/send/reason', {
      body: {
        order_id: props.id,
        reason_ids: reason.value,
        reason_text: text.value,
      },
    })
    .then(() => {
      emit('ranked')
      useCustomToast().showToast(t('your_feedback_has_been_sent'), 'success')
    })
    .catch((e) => {
      useErrorHandling().handleError(e)
    })
    .finally(() => (submitLoading.value = false))
}
</script>
