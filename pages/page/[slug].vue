<template>
  <div class="container grid grid-cols-1 md:grid-cols-12 gap-5">
    <div class="col-span-2"></div>
    <div class="col-span-7 md:pb-10">
      <h1 class="text-xl leading-normal font-extrabold text-dark mb-3">
        {{ data.title }}
      </h1>
      <div class="static-text whitespace-pre-line" v-html="data.content"></div>
    </div>
    <div class="col-span-3"></div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data, error } = await useAsyncData('static-page', () =>
  useApi().$get(`/privacy/policy/`, { params: { slug: route.params.slug } })
)
if (error.value) showError({ statusCode: 404 })
</script>

<style>
.static-text * {
  color: #1c1c1c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
}

.static-text h2 {
  font-size: 16px;
  font-weight: 800;
}

.static-text ol {
  padding-left: 16px;
  list-style-type: numeric;
}
.static-text ul {
  list-style-type: disc;
  padding-left: 16px;
}
</style>
