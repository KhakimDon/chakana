<template>
  <div>
    <div class="grid grid-cols-3 mb-5 gap-4">
      <CommonCardOrder offer-reorder badge-type="canceled" />
      <CommonCardOrder offer-reorder badge-type="delivered" />
      <CommonCardOrder badge-type="accepted" />
    </div>
    <Main />
  </div>
</template>
<script setup lang="ts"></script>
