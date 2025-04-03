<template>
  <div class="home">
    <!-- Banner Section -->
    <div class="home-banner">
      <div class="banner-content">
        <h1 class="banner-title">探索知识的海洋</h1>
        <p class="banner-subtitle">分享技术，记录生活，启发思考</p>
      </div>
    </div>

    <div class="home-content">
      <el-row :gutter="20">
        <!-- 主要内容区域 -->
        <el-col :md="18" :xs="24">
          <!-- 搜索部分 -->
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

        <!-- 侧边栏 -->
        <el-col :md="6" :xs="24">
          <div class="sidebar">
            <!-- 博主信息卡片 -->
            <el-card class="blogger-card">
              <div class="blogger-info">
                <el-avatar :size="100" class="blogger-avatar"
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                <h3 class="blogger-name">技术博主</h3>
                <p class="blogger-desc">热爱技术，分享生活</p>
                <div class="blogger-stats">
                  <div class="stat-item">
                    <div class="stat-num">{{ latestArticles.length }}</div>
                    <div class="stat-label">文章</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num">0</div>
                    <div class="stat-label">分类</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num">0</div>
                    <div class="stat-label">标签</div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
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
.home {
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

/* 主要内容区域 */
.home-content {
  padding: 0 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 30px;
}

/* 文章区块样式 */
.article-section {
  margin-bottom: 40px;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-light);
  padding-bottom: 15px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--el-text-color-primary);
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
  background: var(--el-color-primary);
  border-radius: 2px;
}

.article-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

/* 加载状态 */
.loading-wrapper {
  padding: 20px;
}

/* 侧边栏样式 */
.sidebar {
  position: sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.blogger-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  box-shadow: var(--el-box-shadow-light);
}

.blogger-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.blogger-avatar {
  border: 3px solid var(--el-color-white);
  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.blogger-name {
  margin: 10px 0 5px;
  font-size: 1.3rem;
  color: var(--el-text-color-primary);
}

.blogger-desc {
  color: var(--el-text-color-regular);
  margin: 0 0 15px;
  font-size: 0.95rem;
}

.blogger-stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  border-top: 1px dashed var(--el-border-color-lighter);
  padding-top: 15px;
  margin-top: 10px;
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--el-color-primary);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
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
</style>
