<template>
  <div>
    <h1>I'm an app: {{ message }}</h1>
  </div>
</template>

<style scoped lang="scss">
  h1,
  h2,
  h3 {
    font-size: 16px;
    color: #ff586f;
  }
</style>

<script>
 export default {
    data() {
      return {
        message: 'Hello World!',
      };
    },
  };
</script>
