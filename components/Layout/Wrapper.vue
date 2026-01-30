<template>
  <main class="container  grid grid-cols-1 md:grid-cols-12 gap-5 relative">
    <!-- Left Sidebar - visible or empty placeholder -->
    <aside
      :class="[
        leftSidebarClass,
        'hidden  md:block ',
        { 'fixed z-40': hasFixed && !hideLeftSidebar }
      ]"
      :data-sidebar-cols="props.leftSidebarCols"
      :style="hasFixed && !hideLeftSidebar ? { 
        width: leftSidebarWidth,
        top: sidebarTop
      } : undefined"
    >
      <slot name="left" />
    </aside>
    <!-- Placeholder div for fixed left sidebar when visible -->
    <div
      v-if="hasFixed && !hideLeftSidebar"
      :class="[
        leftSidebarClass,
        'hidden md:block'
      ]"
    />
    <!-- Center Section -->
    <section :class="centerSectionClass">
      <slot />
    </section>
    <!-- Right Sidebar - always visible -->
    <aside class="col-span-3  hidden md:block">
      <slot name="right" />
    </aside>
  </main>
</template>
<script setup lang="ts">
interface Props {
  hasFixed?: boolean
  leftSidebarCols?: 2 | 3 | 4
  hideLeftSidebar?: boolean
  bannerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  leftSidebarCols: 2,
  hideLeftSidebar: false,
  bannerHeight: 0,
})

// Вычисляем позицию sidebar: header height (69px) + banner height + небольшой отступ
const sidebarTop = computed(() => {
  const headerHeight = 69 // Высота header
  const padding = 10 // Небольшой отступ для визуального разделения
  const totalTop = headerHeight + props.bannerHeight + padding
  return `${totalTop}px`
})

// Computed classes for better reactivity
const leftSidebarClass = computed(() => {
  // When hidden, still reserve space but make it invisible
  if (props.hideLeftSidebar) {
    if (props.leftSidebarCols === 4) return 'md:col-span-4 invisible'
    if (props.leftSidebarCols === 3) return 'md:col-span-3 invisible'
    return 'md:col-span-2 invisible'
  }
  if (props.leftSidebarCols === 4) return 'md:col-span-4'
  if (props.leftSidebarCols === 3) return 'md:col-span-3'
  return 'md:col-span-2'
})

// Explicit width to preserve size when fixed positioning removes it from grid flow
const leftSidebarWidth = computed(() => {
  if (props.leftSidebarCols === 3) return '280px'
  return '202px'
})

const centerSectionClass = computed(() => {
  // Center section always takes remaining space after left sidebar (visible or reserved) and right sidebar
  // Right sidebar is always col-span-3, so center = 12 - leftSidebarCols - 3
  if (props.hideLeftSidebar) {
    // Left sidebar is hidden but space is reserved, so center = 12 - leftSidebarCols - 3
    if (props.leftSidebarCols === 4) return 'md:col-span-5' // 12 - 4 - 3 = 5
    if (props.leftSidebarCols === 3) return 'md:col-span-6' // 12 - 3 - 3 = 6
    return 'md:col-span-7' // 12 - 2 - 3 = 7
  }
  // Left sidebar is visible, normal calculation
  if (props.leftSidebarCols === 4) return 'md:col-span-5'
  if (props.leftSidebarCols === 3) return 'md:col-span-6'
  return 'md:col-span-7'
})
</script>
