<template>
  <div class="search-container">
    <div class="search-header">
      <h1 class="page-title">搜索结果</h1>
      <el-input
        v-model="searchQuery"
        placeholder="输入关键词搜索..."
        clearable
        @keyup.enter="performSearch"
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button @click="performSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="results.length === 0 && searched" class="no-results">
      <el-empty description="没有找到相关结果" />
      <p class="suggestion">请尝试使用其他关键词搜索</p>
    </div>

    <div v-else-if="results.length > 0" class="search-results">
      <div v-for="(item, index) in results" :key="index" class="result-item">
        <h2 class="result-title">
          <router-link :to="{ name: 'ArticleDetail', params: { id: item.id } }">
            {{ item.title }}
          </router-link>
        </h2>
        <div class="result-meta">
          <span class="publish-date">
            <el-icon><Calendar /></el-icon>
            {{ formatDate(item.publishDate) }}
          </span>
          <span class="category">
            <el-icon><Collection /></el-icon>
            <router-link :to="{ name: 'CategoryList', query: { id: item.categoryId } }">
              {{ item.category }}
            </router-link>
          </span>
          <span class="view-count">
            <el-icon><View /></el-icon>
            {{ item.viewCount }} 浏览
          </span>
        </div>
        <p class="result-summary">{{ item.summary }}</p>
        <div class="tags">
          <el-tag 
            v-for="tag in item.tags" 
            :key="tag.id" 
            size="small" 
            effect="plain"
            @click="searchByTag(tag.id)"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
    </div>

    <el-pagination
      v-if="results.length > 0"
      layout="prev, pager, next"
      :total="total"
      :page-size="10"
      :current-page="currentPage"
      @current-change="handlePageChange"
      class="pagination"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Search, Calendar, Collection, View } from '@element-plus/icons-vue';

export default {
  name: 'SearchPage',
  components: {
    Search,
    Calendar,
    Collection,
    View
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    const searchQuery = ref('');
    const results = ref([]);
    const loading = ref(false);
    const searched = ref(false);
    const total = ref(0);
    const currentPage = ref(1);
    
    // 从URL参数中获取搜索关键词
    onMounted(() => {
      if (route.query.q) {
        searchQuery.value = route.query.q;
        performSearch();
      }
    });
    
    const performSearch = async () => {
      if (!searchQuery.value.trim()) return;
      
      loading.value = true;
      searched.value = true;
      
      try {
        // 模拟API调用
        setTimeout(() => {
          // 模拟搜索结果
          results.value = generateSampleResults(searchQuery.value);
          total.value = results.value.length * 3; // 模拟总数
          
          // 更新URL以包含搜索参数
          router.replace({ 
            query: { 
              ...route.query, 
              q: searchQuery.value 
            } 
          });
          
          loading.value = false;
        }, 500);
        
      } catch (error) {
        console.error('搜索失败:', error);
        loading.value = false;
      }
    };
    
    const handlePageChange = (page) => {
      currentPage.value = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // 在实际应用中,这里会发送新的API请求获取对应页码的数据
    };
    
    const searchByTag = (tagId) => {
      router.push({ name: 'TagList', query: { id: tagId } });
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    };
    
    // 生成示例数据
    const generateSampleResults = (query) => {
      const sampleData = [
        {
          id: 1,
          title: `关于${query}的深度解析`,
          summary: `这篇文章详细介绍了${query}的基本概念、发展历史以及应用场景,适合初学者阅读...`,
          publishDate: '2025-01-15',
          category: '技术教程',
          categoryId: 1,
          viewCount: 1250,
          tags: [
            { id: 1, name: '教程' },
            { id: 2, name: '前端' }
          ]
        },
        {
          id: 2,
          title: `${query}在项目开发中的实践经验分享`,
          summary: `基于实际项目经验,分享${query}在企业级应用中的最佳实践和常见陷阱...`,
          publishDate: '2025-02-20',
          category: '经验分享',
          categoryId: 2,
          viewCount: 853,
          tags: [
            { id: 2, name: '前端' },
            { id: 3, name: '实践' }
          ]
        },
        {
          id: 3,
          title: `${query}与现代Web开发`,
          summary: `探讨${query}技术在现代Web开发中的应用趋势和未来发展方向...`,
          publishDate: '2025-03-05',
          category: '前沿技术',
          categoryId: 3,
          viewCount: 621,
          tags: [
            { id: 4, name: 'Web' },
            { id: 5, name: '趋势' }
          ]
        }
      ];
      
      return sampleData;
    };
    
    return {
      searchQuery,
      results,
      loading,
      searched,
      total,
      currentPage,
      performSearch,
      handlePageChange,
      searchByTag,
      formatDate
    };
  }
};
</script>

<style scoped>
.search-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.search-header {
  margin-bottom: 30px;
}

.page-title {
  margin-bottom: 20px;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.search-input {
  max-width: 600px;
}

.loading-container {
  margin-top: 30px;
}

.no-results {
  margin-top: 40px;
  text-align: center;
}

.suggestion {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}

.search-results {
  margin-top: 20px;
}

.result-item {
  padding: 20px 0;
  border-bottom: 1px solid #EBEEF5;
}

.result-item:last-child {
  border-bottom: none;
}

.result-title {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 500;
}

.result-title a {
  color: #409EFF;
  text-decoration: none;
  transition: color 0.2s;
}

.result-title a:hover {
  color: #66b1ff;
}

.result-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
  font-size: 14px;
  color: #909399;
}

.result-meta span {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.result-meta .el-icon {
  margin-right: 5px;
  font-size: 16px;
}

.result-meta a {
  color: #909399;
  text-decoration: none;
}

.result-meta a:hover {
  color: #409EFF;
}

.result-summary {
  margin: 10px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags .el-tag {
  cursor: pointer;
}

.pagination {
  margin-top: 30px;
  text-align: center;
}

@media (max-width: 768px) {
  .search-container {
    padding: 15px;
  }
  
  .result-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .result-meta span {
    margin-bottom: 5px;
  }
}
</style>
