<template>
  <div class="archive-list">
    <h1 class="page-title">归档</h1>
    
    <div class="timeline">
      <div v-for="year in archives" :key="year.year" class="year-section">
        <div class="year-header">
          <h2 class="year-title">{{ year.year }}</h2>
          <div class="article-count">{{ year.articles.length }} 篇文章</div>
        </div>
        
        <el-timeline>
          <el-timeline-item 
            v-for="article in year.articles" 
            :key="article.id"
            :timestamp="formatDate(article.date)" 
            :type="getRandomType()"
          >
            <el-card class="archive-card" @click="navigateToArticle(article.id)">
              <h3 class="article-title">{{ article.title }}</h3>
              <div class="article-meta">
                <el-tag size="small" class="category-tag">{{ article.category }}</el-tag>
                <div class="tag-list">
                  <el-tag 
                    v-for="tag in article.tags" 
                    :key="tag" 
                    size="small" 
                    type="info" 
                    effect="plain"
                    class="article-tag"
                  >{{ tag }}</el-tag>
                </div>
              </div>
              <p class="article-summary">{{ article.summary }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ArchiveList',
  setup() {
    const router = useRouter();
    
    // 模拟归档数据,按年份分组的文章
    const archives = ref([
      {
        year: '2025',
        articles: [
          {
            id: 1,
            title: 'Vue3 组合式 API 详解',
            summary: '本文深入探讨了 Vue3 的组合式 API 如何改变前端开发模式',
            date: '2025-03-10',
            category: '技术',
            tags: ['Vue', 'JavaScript']
          },
          {
            id: 2,
            title: 'TypeScript 高级类型体操',
            summary: '如何利用TypeScript的高级类型系统构建类型安全的应用程序',
            date: '2025-03-05',
            category: '技术',
            tags: ['TypeScript', 'JavaScript']
          }
        ]
      },
      {
        year: '2024',
        articles: [
          {
            id: 3,
            title: '现代CSS布局技巧',
            summary: '使用Grid和Flexbox创建响应式和复杂的页面布局',
            date: '2024-11-28',
            category: '技术',
            tags: ['CSS', 'HTML']
          },
          {
            id: 4,
            title: '年终总结:我的2024年编程之旅',
            summary: '回顾2024年学到的技术和完成的项目',
            date: '2024-12-25',
            category: '生活',
            tags: ['年终总结', '编程']
          },
          {
            id: 5,
            title: 'Node.js性能调优实战',
            summary: '如何诊断和解决Node.js应用程序中的性能问题',
            date: '2024-10-20',
            category: '技术',
            tags: ['Node.js', '性能优化']
          }
        ]
      }
    ]);
    
    // 随机选择一个时间线项目类型,用于视觉上的变化
    const timelineTypes = ['primary', 'success', 'warning', 'danger', 'info'];
    const getRandomType = () => {
      const randomIndex = Math.floor(Math.random() * timelineTypes.length);
      return timelineTypes[randomIndex];
    };
    
    const navigateToArticle = (id) => {
      router.push({ name: 'ArticleDetail', params: { id } });
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return {
      archives,
      getRandomType,
      navigateToArticle,
      formatDate
    };
  }
});
</script>

<style scoped>
.archive-list {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
}

.year-section {
  margin-bottom: 3rem;
}

.year-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.year-title {
  font-size: 1.6rem;
  color: #333;
  margin: 0;
}

.article-count {
  background-color: #f0f0f0;
  color: #666;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.archive-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.archive-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.1rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.tag-list {
  display: flex;
  gap: 5px;
}

.article-tag {
  margin-left: 5px;
}

.article-summary {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
