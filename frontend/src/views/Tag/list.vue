<template>
  <div class="tag-list">
    <h1 class="page-title">标签</h1>
    
    <div class="tags-cloud">
      <el-tag
        v-for="tag in allTags"
        :key="tag.name"
        :type="getTagType(tag.count)"
        :effect="selectedTag === tag.name ? 'dark' : 'light'"
        :size="getTagSize(tag.count)"
        @click="selectTag(tag.name)"
        class="tag-item"
      >
        {{ tag.name }} ({{ tag.count }})
      </el-tag>
    </div>
    
    <div v-if="selectedTag" class="tag-articles">
      <div class="selected-tag-header">
        <h2>
          <el-tag :type="getTagType(getSelectedTagCount())" effect="dark">{{ selectedTag }}</el-tag>
          相关文章
        </h2>
        <el-button size="small" @click="clearSelectedTag">全部标签</el-button>
      </div>
      
      <el-card v-for="article in filteredArticles" :key="article.id" class="article-card" @click="navigateToArticle(article.id)">
        <div class="article-info">
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-summary">{{ article.summary }}</p>
          <div class="article-meta">
            <span class="article-date">
              <i class="far fa-calendar-alt"></i>
              {{ formatDate(article.date) }}
            </span>
            <span class="article-category">
              <i class="far fa-folder"></i>
              {{ article.category }}
            </span>
          </div>
        </div>
      </el-card>
    </div>
    
    <el-empty v-else description="请选择一个标签查看相关文章"></el-empty>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'TagList',
  setup() {
    const router = useRouter();
    const selectedTag = ref('');
    
    // 模拟标签数据
    const allTags = ref([
      { name: 'Vue', count: 8 },
      { name: 'JavaScript', count: 12 },
      { name: 'CSS', count: 5 },
      { name: 'HTML', count: 3 },
      { name: '前端', count: 15 },
      { name: '后端', count: 7 },
      { name: 'Node.js', count: 6 },
      { name: 'TypeScript', count: 9 },
      { name: '性能优化', count: 4 },
      { name: '开发工具', count: 2 },
      { name: '设计模式', count: 3 },
      { name: 'React', count: 5 },
      { name: '数据库', count: 3 },
      { name: 'Docker', count: 2 },
      { name: '微服务', count: 1 }
    ]);
    
    // 模拟文章数据
    const articles = ref([
      {
        id: 1,
        title: 'Vue3 组合式 API 详解',
        summary: '本文深入探讨了 Vue3 的组合式 API 如何改变前端开发模式,以及对比 Options API 的优势',
        date: '2025-03-10',
        category: '技术',
        tags: ['Vue', '前端', 'JavaScript']
      },
      {
        id: 2,
        title: 'TypeScript 高级类型体操',
        summary: '如何利用TypeScript的高级类型系统构建类型安全的应用程序',
        date: '2025-03-05',
        category: '技术',
        tags: ['TypeScript', '前端', 'JavaScript']
      },
      {
        id: 3,
        title: '现代CSS布局技巧',
        summary: '使用Grid和Flexbox创建响应式和复杂的页面布局',
        date: '2025-02-28',
        category: '技术',
        tags: ['CSS', '前端', 'HTML']
      },
      {
        id: 4,
        title: 'Node.js性能调优实战',
        summary: '如何诊断和解决Node.js应用程序中的性能问题',
        date: '2025-02-20',
        category: '技术',
        tags: ['Node.js', '后端', '性能优化']
      }
    ]);
    
    // 根据选中的标签过滤文章
    const filteredArticles = computed(() => {
      if (!selectedTag.value) return articles.value;
      return articles.value.filter(article => article.tags.includes(selectedTag.value));
    });
    
    const selectTag = (tagName) => {
      selectedTag.value = tagName;
    };
    
    const clearSelectedTag = () => {
      selectedTag.value = '';
    };
    
    // 根据文章数量获取标签的类型
    const getTagType = (count) => {
      if (count >= 10) return 'success';
      if (count >= 5) return 'primary';
      if (count >= 3) return 'warning';
      return 'info';
    };
    
    // 根据文章数量获取标签的大小
    const getTagSize = (count) => {
      if (count >= 10) return '';  // 默认大小
      if (count >= 5) return '';   // 默认大小
      return 'small';
    };
    
    // 获取当前选中标签的文章数量
    const getSelectedTagCount = () => {
      const tag = allTags.value.find(t => t.name === selectedTag.value);
      return tag ? tag.count : 0;
    };
    
    const navigateToArticle = (id) => {
      router.push({ name: 'ArticleDetail', params: { id } });
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return {
      selectedTag,
      allTags,
      filteredArticles,
      selectTag,
      clearSelectedTag,
      getTagType,
      getTagSize,
      getSelectedTagCount,
      navigateToArticle,
      formatDate
    };
  }
});
</script>

<style scoped>
.tag-list {
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

.tags-cloud {
  margin-bottom: 2rem;
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.tag-item {
  margin: 5px;
  cursor: pointer;
  transition: transform 0.2s;
}

.tag-item:hover {
  transform: translateY(-2px);
}

.selected-tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.article-card {
  margin-bottom: 15px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-info {
  padding: 10px 0;
}

.article-title {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
}

.article-summary {
  color: #666;
  margin-bottom: 15px;
  font-size: 0.95rem;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  gap: 15px;
  color: #909399;
  font-size: 0.85rem;
}

.article-date i,
.article-category i {
  margin-right: 5px;
}

.article-category {
  color: #42b983;
}
</style>
