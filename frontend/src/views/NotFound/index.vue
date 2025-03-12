<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <el-result
        icon="warning"
        title="404"
        sub-title="抱歉，您访问的页面不存在"
      >
        <template #extra>
          <el-button type="primary" @click="goHome">返回首页</el-button>
          <el-button @click="goBack">返回上一页</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'NotFoundPage',
  setup() {
    const router = useRouter();
    
    const goHome = () => {
      router.push({ name: 'Home' });
    };
    
    const goBack = () => {
      router.go(-1);
    };
    
    return {
      goHome,
      goBack
    };
  }
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* 60px是导航栏高度 */
  padding: 20px;
  background-color: #f5f7fa;
}

.not-found-content {
  max-width: 600px;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .not-found-content {
    padding: 20px;
  }
}
</style>
