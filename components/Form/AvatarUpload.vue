<template>
  <div class="flex-y-center w-fit flex-col gap-1 relative">
    <input
      id="file-avatar"
      :key="image"
      type="file"
      class="w-0 h-0 absolute pointer-events-none opacity-0"
      accept=".jpg, .png, .jpeg, .svg"
      @change="handleChange"
    />
    <div
      class="w-[92px] h-[92px] shrink-0 rounded-full border border-white-100 relative overflow-hidden flex-center cursor-pointer group"
      @click="getFile"
    >
      <img
        v-if="image"
        :src="image"
        alt="profile-avatar"
        class="w-full h-full object-cover"
      />
      <IconPhotoAdd v-else class="text-[32px]" />

      <div
        v-if="image"
        class="absolute inset-0 flex-center group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none opacity-0 bg-dark/60 transition-300"
      >
        <SvgoCommonEditPenSquare class="text-2xl leading-6 text-white" />
      </div>
    </div>
    <CollapseTransition>
      <button
        v-if="hasImage"
        class="text-xs leading-5 font-medium text-red"
        @click="removeImage"
      >
        {{ $t('delete_avatar') }}
      </button>
    </CollapseTransition>
  </div>
</template>

<script setup lang="ts">
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue'

import IconPhotoAdd from '~/assets/icons/Common/photo-add.svg'

interface Props {
  defaultImage?: string | File
  hasImage?: boolean
}

const props = defineProps<Props>()

const image = ref<any>('')

const emit = defineEmits(['change'])

function handleChange(event: any) {
  const target = event?.target as HTMLInputElement | null
  const file = target?.files[0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  emit('change', file)

  reader.onload = () => {
    image.value = reader.result
  }
}

const getFile = () => {
  const input = document.getElementById('file-avatar')
  input?.click()
}

function removeImage() {
  emit('change', null)
  image.value = ''
}

watch(
  () => props.defaultImage,
  () => {
    if (typeof props.defaultImage === 'string') {
      image.value = props.defaultImage
    }
  },
  {
    immediate: true,
  }
)
</script>

<style scoped>
.edit-shadow {
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
}
</style>
