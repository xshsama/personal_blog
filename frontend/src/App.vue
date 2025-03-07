<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
  min-height: 100vh;
}

.el-container {
  height: 100%;
}

.el-card {
  --el-card-padding: 16px;
  border: none;
  overflow: visible;

  .el-card__body {
    padding: var(--el-card-padding);
  }
}

.el-menu {
  --el-menu-hover-bg-color: var(--el-color-primary-light-9);
}

.el-button--primary {
  --el-button-bg-color: #42b983;
  --el-button-border-color: #42b983;
  --el-button-hover-bg-color: #3aa876;
  --el-button-hover-border-color: #3aa876;
}

.el-button--success {
  --el-button-bg-color: #67c23a;
  --el-button-border-color: #67c23a;
  --el-button-hover-bg-color: #5db435;
  --el-button-hover-border-color: #5db435;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
