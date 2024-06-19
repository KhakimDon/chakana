<template>
  <div class="max-md:pb-16">
    <LayoutHeader
      v-if="useMobile('desktop')"
      class="sticky top-0 bg-white z-10"
    />
    <LayoutHeaderMobile v-else class="sticky top-0 bg-white z-10" />
    <div class="md:min-h-[calc(100vh-69px)] min-h-[calc(100vh-68px-64px)] py-4">
      <slot />
    </div>
    <LayoutMobileBottomBar v-if="!useMobile('desktop')" />
  </div>
</template>
