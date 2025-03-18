<template>
  <MainLayout />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainLayout from './layout/MainLayout.vue';

export default defineComponent({
  name: 'App',
  components: {
    MainLayout
  }
})
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-color, #f5f7fa);
  color: var(--text-color, #333);
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
  }

  .el-card__body {
    padding: var(--el-card-padding);
  }

  .el-card__header {
    padding: 16px 20px;
    font-weight: 500;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 美化表格 */
.el-table {
  --el-table-border-color: #ebeef5;
  border-radius: 8px;
  overflow: hidden;

  th.el-table__cell {
    background-color: #f5f7fa;
    font-weight: 500;
  }

  .el-table__row:hover>td {
    background-color: #f0f9eb;
  }
}

/* 美化表单 */
.el-form-item__label {
  font-weight: 500;
}

.el-input__wrapper,
.el-textarea__wrapper {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;

  &:hover,
  &.is-focus {
    box-shadow: 0 0 0 1px var(--el-color-primary);
  }
}

/* 美化分页 */
.el-pagination {
  margin-top: 20px;
  justify-content: center;
}
</style>
