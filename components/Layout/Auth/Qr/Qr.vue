<template>
  <div>
    <div class="flex-center w-full">
      <div class="w-[207px]">
        <div class="p-5 rounded-2xl border-2 border-gray-200">
          <LayoutAuthQrGenerator text="asjkdoasndoiasndaosidnoaisnd" />
        </div>

        <div class="h-1 bg-white-100 rounded-full mt-5">
          <div class="w-0 bg-orange rounded-full h-1 fill-animation" />
        </div>


      </div>

    </div>
    <div class="text-center mt-6">
      <p class="text-xl leading-130 font-bold text-dark">{{$t('scan_qr')}}</p>
      <p class="text-xs leading-130 text-gray-100 mt-1">{{$t('scan_qr_text')}}</p>
    </div>
  </div>
</template>

<style scoped>

.fill-animation {
  animation: fill 15s linear forwards;
}

@keyframes fill {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
