<template>
  <div>
    <LayoutHeader
      v-if="useMobile('desktop')"
      class="fixed top-0 bg-white z-10"
    />
    <LayoutHeaderMobile v-else class="sticky top-0 bg-white z-10" />
    <div class="max-md:min-h-[calc(100vh-68px-64px)]">
      <slot />
    </div>
    <LayoutMobileBottomBar />
  </div>
</template>
