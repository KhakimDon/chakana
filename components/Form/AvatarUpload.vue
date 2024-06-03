<template>
  <div class="flex-y-center gap-3 relative">
    <input
      id="file-avatar"
      :key="image"
      type="file"
      class="w-0 h-0 absolute pointer-events-none"
      accept=".jpg, .png, .jpeg, .svg"
      @change="handleChange"
    />
    <div
      class="w-[92px] h-[92px] rounded-full border border-white-100 relative overflow-hidden flex-center cursor-pointer"
      @click="getFile"
    >
      <img
        v-if="image"
        :src="image"
        alt="profile-avatar"
        class="w-full h-full object-cover"
      />
      <IconPhotoAdd v-else class="text-[32px]" />

      <!--      <img-->
      <!--        v-else-->
      <!--        src="/images/default/default.svg"-->
      <!--        alt="profile-avatar"-->
      <!--        class="object-cover w-[78px] mx-auto absolute-x -bottom-2"-->
      <!--      />-->
    </div>
    <div
      v-if="image"
      class="flex-center absolute-x -bottom-3 bg-white w-8 h-8 rounded-full border-[0.5px] border-white-100 edit-shadow cursor-pointer hover:border-orange transition-300"
      @click="getFile"
    >
      <IconEditPen class="text-gray-100 text-xl" />
    </div>
    <!--    <div class="flex flex-col gap-2">-->
    <!--      <button-->
    <!--        class="min-w-[104px] px-4 py-1 rounded-lg text-sm leading-normal font-normal text-dark transition-300 border border-gray-400 hover:border-green"-->
    <!--        @click="getFile"-->
    <!--      >-->
    <!--        {{ $t('change') }}-->
    <!--      </button>-->
    <!--      <button-->
    <!--        v-if="image"-->
    <!--        class="min-w-[104px] px-4 py-1 rounded-lg text-sm leading-normal font-normal text-dark transition-300 border border-red hover:border-red/40"-->
    <!--        @click="removeImage"-->
    <!--      >-->
    <!--        {{ $t('delete') }}-->
    <!--      </button>-->
    <!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import IconEditPen from '~/assets/icons/Common/edit-pen-square.svg'
import IconPhotoAdd from '~/assets/icons/Common/photo-add.svg'

interface Props {
  defaultImage?: string | File
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
