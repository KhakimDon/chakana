<template>
  <div class="w-full">
    <div class="flex flex-col gap-1.5 h-[calc(100vh-150px)] overflow-y-auto">
      <MainSidebarItem
        v-for="(item, index) in list"
        :key="index"
        v-bind="{ item }"
      />
      <MainSidebarItemLoading v-for="index in 9" :key="index" />
    </div>
  </div>
</template>
<script setup lang="ts">
const list = [
  {
    id: 1,
    image: '/images/fake/meat.webp',
    title: 'Meat',
  },
  {
    id: 2,
    image: '/images/fake/meat.webp',
    title: 'Vegetables',
  },
  {
    id: 3,
    image: '/images/fake/meat.webp',
    title: 'Fruits',
  },
  {
    id: 4,
    image: '/images/fake/meat.webp',
    title: 'Dairy',
  },
  {
    id: 5,
    image: '/images/fake/meat.webp',
    title: 'Fish',
  },
  {
    id: 6,
    image: '/images/fake/meat.webp',
    title: 'Bread',
  },
  {
    id: 7,
    image: '/images/fake/meat.webp',
    title: 'Sweets',
  },
  {
    id: 8,
    image: '/images/fake/meat.webp',
    title: 'Drinks',
  },
  {
    id: 9,
    image: '/images/fake/meat.webp',
    title: 'Other',
  },
  // {
  //   id: 1,
  //   image: '/images/fake/meat.webp',
  //   title: 'Meat',
  // },
  // {
  //   id: 2,
  //   image: '/images/fake/meat.webp',
  //   title: 'Vegetables',
  // },
  // {
  //   id: 3,
  //   image: '/images/fake/meat.webp',
  //   title: 'Fruits',
  // },
  // {
  //   id: 4,
  //   image: '/images/fake/meat.webp',
  //   title: 'Dairy',
  // },
  // {
  //   id: 5,
  //   image: '/images/fake/meat.webp',
  //   title: 'Fish',
  // },
  // {
  //   id: 6,
  //   image: '/images/fake/meat.webp',
  //   title: 'Bread',
  // },
  // {
  //   id: 7,
  //   image: '/images/fake/meat.webp',
  //   title: 'Sweets',
  // },
  // {
  //   id: 8,
  //   image: '/images/fake/meat.webp',
  //   title: 'Drinks',
  // },
  // {
  //   id: 9,
  //   image: '/images/fake/meat.webp',
  //   title: 'Other',
  // },
  // {
  //   id: 1,
  //   image: '/images/fake/meat.webp',
  //   title: 'Meat',
  // },
  // {
  //   id: 2,
  //   image: '/images/fake/meat.webp',
  //   title: 'Vegetables',
  // },
  // {
  //   id: 3,
  //   image: '/images/fake/meat.webp',
  //   title: 'Fruits',
  // },
  // {
  //   id: 4,
  //   image: '/images/fake/meat.webp',
  //   title: 'Dairy',
  // },
  // {
  //   id: 5,
  //   image: '/images/fake/meat.webp',
  //   title: 'Fish',
  // },
  // {
  //   id: 6,
  //   image: '/images/fake/meat.webp',
  //   title: 'Bread',
  // },
  // {
  //   id: 7,
  //   image: '/images/fake/meat.webp',
  //   title: 'Sweets',
  // },
  // {
  //   id: 8,
  //   image: '/images/fake/meat.webp',
  //   title: 'Drinks',
  // },
  // {
  //   id: 9,
  //   image: '/images/fake/meat.webp',
  //   title: 'Other',
  // },
]
</script>
