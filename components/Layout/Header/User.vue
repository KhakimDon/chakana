<template>
  <BaseDropdown>
    <template #head>
      <div class="w-9 h-9 rounded-full linear-border-image">
        <img
          src="/images/default/user.png"
          alt="user-default"
          class="w-full h-full"
        />
      </div>
    </template>
  </BaseDropdown>
</template>

<script setup lang="ts"></script>

<style scoped>
.linear-border-image {
  background: radial-gradient(
        circle at 100% 100%,
        #ffffff 0,
        #ffffff 17px,
        transparent 17px
      )
      0% 0%/19px 19px no-repeat,
    radial-gradient(circle at 0 100%, #ffffff 0, #ffffff 17px, transparent 17px)
      100% 0%/19px 19px no-repeat,
    radial-gradient(circle at 100% 0, #ffffff 0, #ffffff 17px, transparent 17px)
      0% 100%/19px 19px no-repeat,
    radial-gradient(circle at 0 0, #ffffff 0, #ffffff 17px, transparent 17px)
      100% 100%/19px 19px no-repeat,
    linear-gradient(#ffffff, #ffffff) 50% 50% / calc(100% - 4px)
      calc(100% - 38px) no-repeat,
    linear-gradient(#ffffff, #ffffff) 50% 50% / calc(100% - 38px)
      calc(100% - 4px) no-repeat,
    linear-gradient(#ff831b 0%, #ff3300 100%);
  border-radius: 19px;
  padding: 2px;
  box-sizing: border-box;
}
</style>
