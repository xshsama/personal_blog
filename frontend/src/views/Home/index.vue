<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="search-section">
          <el-input v-model="searchQuery" placeholder="搜索文章..." @keyup.enter="handleSearch">
            <template #append>
              <el-button @click="handleSearch">
                <el-icon>
                  <Search />
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </div>

        <!-- 最新文章部分 -->
        <div class="article-section">
          <div class="section-header">
            <h2>最新文章</h2>
            <el-button text @click="router.push('/articles')" class="more-link">
              更多文章
              <el-icon>
                <ArrowRight />
              </el-icon>
            </el-button>
          </div>
          <div v-if="loading" class="loading-wrapper">
            <el-skeleton :rows="3" animated />
          </div>
          <div v-else class="article-list">
            <article-card v-for="article in latestArticles" :key="article.id" :article="article"
              @click="goToArticle(article.id)" />
          </div>
        </div>

        <!-- 热门文章部分 -->
        <div class="article-section">
          <div class="section-header">
            <h2>热门文章</h2>
            <el-button text @click="router.push('/articles')" class="more-link">
              更多文章
              <el-icon>
                <ArrowRight />
              </el-icon>
            </el-button>
          </div>
          <div v-if="loading" class="loading-wrapper">
            <el-skeleton :rows="3" animated />
          </div>
          <div v-else class="article-list">
            <article-card v-for="article in hotArticles" :key="article.id" :article="article"
              @click="goToArticle(article.id)" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { ArrowDown, ArrowRight, Folder, PriceTag, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ArticleCard from '../../components/ArticleCard.vue';
import articleService from '../../services/article.service';
import { Article } from '../../types/article';

export default defineComponent({
  name: 'HomeView',
  components: {
    ArticleCard,
    ArrowDown,
    ArrowRight,
    Folder,
    PriceTag,
    Search
  },
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const searchQuery = ref('');
    const latestArticles = ref<Article[]>([]);
    const hotArticles = ref<Article[]>([]);

    // 加载最新文章
    const loadLatestArticles = async () => {
      try {
        const response = await articleService.getArticles({
          page: 0,
          size: 6,
          sortBy: 'createdAt',
          sortDir: 'desc'
        });
        latestArticles.value = response.content;
      } catch (error) {
        console.error('获取最新文章失败:', error);
        ElMessage.error('获取最新文章失败');
      }
    };

    // 加载热门文章
    const loadHotArticles = async () => {
      try {
        const response = await articleService.getArticles({
          page: 0,
          size: 6,
          sortBy: 'viewCount',
          sortDir: 'desc'
        });
        hotArticles.value = response.content;
      } catch (error) {
        console.error('获取热门文章失败:', error);
        ElMessage.error('获取热门文章失败');
      }
    };

    // 搜索处理
    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          path: '/search',
          query: { q: searchQuery.value }
        });
      }
    };

    // 跳转到文章详情
    const goToArticle = (id: number) => {
      router.push(`/article/${id}`);
    };

    // 初始化加载
    onMounted(async () => {
      loading.value = true;
      try {
        await Promise.all([
          loadLatestArticles(),
          loadHotArticles()
        ]);
      } finally {
        loading.value = false;
      }
    });

    return {
      searchQuery,
      latestArticles,
      hotArticles,
      loading,
      handleSearch,
      goToArticle,
      router
    };
  }
});
</script>

<style scoped>
/* 全局样式 */
.home-view {
  width: 100%;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部横幅样式 */
.home-banner {
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.home-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("https://source.unsplash.com/random/1920x1080?nature,water") center/cover no-repeat;
  opacity: 0.2;
  z-index: 0;
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 20px;
  max-width: 700px;
}

.banner-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  animation: fadeInDown 0.8s ease;
}

.banner-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: fadeInUp 0.8s ease 0.3s both;
}

.banner-cta {
  animation: bounceIn 1s ease 0.6s both;
  padding: 12px 24px;
  font-size: 1rem;
}

/* 主要内容区域 */
.home-content {
  padding: 0 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 文章区块样式 */
.article-section {
  margin-bottom: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  position: relative;
  padding-left: 15px;
}

.section-header h2:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: #409EFF;
  border-radius: 2px;
}

.article-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.article-item {
  transition: all 0.3s ease;
}

/* 文章列表动画 */
.article-list-enter-active,
.article-list-leave-active {
  transition: all 0.5s ease;
}

.article-list-enter-from,
.article-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

.load-more-btn {
  font-size: 1rem;
}

/* 侧边栏样式 */
.sidebar {
  position: sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.blogger-card,
.category-card,
.tag-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
}

.blogger-card:hover,
.category-card:hover,
.tag-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.blogger-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.blogger-avatar {
  border: 3px solid #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.blogger-avatar:hover {
  transform: rotate(5deg) scale(1.05);
}

.blogger-name {
  margin: 10px 0 5px;
  font-size: 1.3rem;
  color: #333;
}

.blogger-desc {
  color: #666;
  margin: 0 0 15px;
  font-size: 0.95rem;
}

.blogger-stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  border-top: 1px dashed #eee;
  padding-top: 15px;
  margin-top: 10px;
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 1.5rem;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 0.8rem;
  color: #999;
}

.search-box {
  margin-bottom: 5px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.card-header .el-icon {
  margin-right: 8px;
}

.categories,
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-item,
.tag-item {
  text-decoration: none;
  transition: all 0.3s ease;
}

.category-item:hover,
.tag-item:hover {
  transform: translateY(-2px);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .banner-title {
    font-size: 2.3rem;
  }

  .article-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 2rem;
  }

  .home-banner {
    height: 300px;
  }

  .sidebar {
    position: static;
    margin-top: 30px;
  }
}

@media (max-width: 576px) {
  .banner-title {
    font-size: 1.8rem;
  }

  .banner-subtitle {
    font-size: 1.1rem;
  }

  .home-banner {
    height: 250px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .article-list {
    grid-template-columns: 1fr;
  }
}

/* 动画关键帧 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}
</style>
