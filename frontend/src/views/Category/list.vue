<template>
  <div class="category-list">
    <h1 class="page-title">分类</h1>
    
    <div class="categories">
      <el-card v-for="category in categories" :key="category.name" class="category-card">
        <div class="category-header">
          <h2 class="category-name">{{ category.name }}</h2>
          <el-tag>{{ category.count }} 篇文章</el-tag>
        </div>
        <div class="article-list">
          <div class="article-item" v-for="article in category.articles" :key="article.id" @click="navigateToArticle(article.id)">
            <span class="article-title">{{ article.title }}</span>
            <span class="article-date">{{ formatDate(article.date) }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CategoryList',
  setup() {
    const router = useRouter();
    
    const categories = ref([
      {
        name: '技术',
        count: 5,
        articles: [
          { id: 1, title: 'Vue3 组合式 API 详解', date: '2025-03-10' },
          { id: 2, title: 'JavaScript 异步编程最佳实践', date: '2025-03-05' },
          { id: 3, title: '深入理解 Vue 响应式原理', date: '2025-02-28' }
        ]
      },
      {
        name: '生活',
        count: 3,
        articles: [
          { id: 4, title: '我的年度阅读书单', date: '2025-03-01' },
          { id: 5, title: '远程工作经验分享', date: '2025-02-15' }
        ]
      },
      {
        name: '杂谈',
        count: 2,
        articles: [
          { id: 6, title: '技术写作心得', date: '2025-02-20' },
          { id: 7, title: '如何平衡工作与生活', date: '2025-01-28' }
        ]
      }
    ]);
    
    const navigateToArticle = (id) => {
      router.push({ name: 'ArticleDetail', params: { id } });
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return {
      categories,
      navigateToArticle,
      formatDate
    };
  }
});
</script>

<style scoped>
.category-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
}

.categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.category-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.category-name {
  margin: 0;
  color: #42b983;
  font-size: 1.2rem;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.article-item:hover {
  background-color: #f5f7fa;
}

.article-title {
  color: #333;
  font-size: 0.9rem;
  flex-grow: 1;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-date {
  color: #909399;
  font-size: 0.8rem;
}
</style>
