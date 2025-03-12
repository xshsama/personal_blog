<template>
  <div class="home-view">
    <!-- 顶部横幅区域 -->
    <div class="home-banner">
      <div class="banner-content">
        <h1 class="banner-title">欢迎来到我的博客</h1>
        <p class="banner-subtitle">分享技术、生活和更多精彩内容</p>
        <el-button type="primary" size="large" @click="scrollToContent" class="banner-cta">
          开始阅读
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="home-content" ref="contentRef">
      <el-row :gutter="24">
        <!-- 左侧文章列表 -->
        <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
          <!-- 带有切换效果的文章区块 -->
          <div class="article-section">
            <div class="section-header">
              <h2>精选文章</h2>
              <div class="section-tabs">
                <el-radio-group v-model="activeTab" size="small">
                  <el-radio-button label="latest">最新文章</el-radio-button>
                  <el-radio-button label="hot">热门文章</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="article-list">
              <article-card 
                v-for="article in displayArticles" 
                :key="article.id" 
                :article="article"
                class="article-item" 
              />
            </div>

            <div class="load-more">
              <el-button type="primary" text class="load-more-btn">
                查看更多文章
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </el-col>

        <!-- 右侧侧边栏 -->
        <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
          <div class="sidebar">
            <!-- 博主信息卡片 -->
            <el-card class="blogger-card">
              <div class="blogger-info">
                <el-avatar :size="100" :src="getImageUrl(100, 100, 5)" class="blogger-avatar" />
                <h3 class="blogger-name">博主昵称</h3>
                <p class="blogger-desc">用热爱创造价值 | 前端开发工程师</p>
                <div class="blogger-stats">
                  <div class="stat-item">
                    <div class="stat-num">{{ articleCount }}</div>
                    <div class="stat-label">文章</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num">{{ categoryCount }}</div>
                    <div class="stat-label">分类</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num">{{ tagCount }}</div>
                    <div class="stat-label">标签</div>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- 搜索框 -->
            <div class="search-box">
              <el-input 
                v-model="searchKeyword" 
                placeholder="搜索文章..." 
                clearable
                prefix-icon="Search"
                @keyup.enter="handleSearch" 
              >
                <template #append>
                  <el-button @click="handleSearch">搜索</el-button>
                </template>
              </el-input>
            </div>

            <!-- 分类卡片 -->
            <el-card class="category-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Folder /></el-icon>
                  <span>分类</span>
                </div>
              </template>
              <div class="categories">
                <router-link 
                  v-for="(category, index) in categories" 
                  :key="index"
                  :to="`/category/${category}`" 
                  class="category-item"
                >
                  <el-tag :style="getCategoryStyle(index)" effect="light">
                    {{ category }}
                  </el-tag>
                </router-link>
              </div>
            </el-card>

            <!-- 标签云卡片 -->
            <el-card class="tag-card">
              <template #header>
                <div class="card-header">
                  <el-icon><PriceTag /></el-icon>
                  <span>标签云</span>
                </div>
              </template>
              <div class="tags">
                <router-link 
                  v-for="(tag, index) in tags" 
                  :key="index"
                  :to="`/tag/${tag}`" 
                  class="tag-item"
                >
                  <el-tag 
                    size="small" 
                    :type="getRandomTagType()" 
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </router-link>
              </div>
            </el-card>

          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ArrowDown, ArrowRight, Folder, PriceTag, Search } from '@element-plus/icons-vue';
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import ArticleCard from '../../components/ArticleCard.vue';
import { getImageUrl } from '../../utils/image';

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
    const contentRef = ref(null);
    const activeTab = ref('latest');
    const searchKeyword = ref('');
    
    // 模拟数据
    const latestArticles = [
      {
        id: 1,
        title: '如何使用Vue3构建现代化Web应用',
        summary: '本文将详细介绍Vue3的新特性及其在构建现代Web应用中的应用，包括Composition API、响应式系统等核心概念的最佳实践。',
        date: '2025-03-10',
        viewCount: 100,
        commentCount: 20,
        tags: ['Vue', '前端'],
        category: '技术',
        cover: getImageUrl(800, 400, 1),
      },
      {
        id: 2,
        title: 'TypeScript高级技巧与实战应用',
        summary: '深入探讨TypeScript的高级特性，包括类型推断、泛型、装饰器等，并通过实际项目案例展示如何提升代码质量和开发效率。',
        date: '2025-03-09',
        viewCount: 120,
        commentCount: 15,
        tags: ['TypeScript', '编程'],
        category: '技术',
        cover: getImageUrl(800, 400, 2),
      },
    ];

    const hotArticles = [
      {
        id: 3,
        title: '前端框架对比：React vs Vue vs Angular',
        summary: '详细分析当前三大主流前端框架的优缺点、适用场景及性能对比，帮助开发者选择最适合自己项目的技术栈。',
        date: '2025-03-01',
        viewCount: 500,
        commentCount: 100,
        tags: ['框架', '前端'],
        category: '技术',
        cover: getImageUrl(800, 400, 3),
      },
      {
        id: 4,
        title: '2025年前端开发趋势预测',
        summary: '基于当前技术发展态势，分析2025年前端开发领域可能出现的新技术、新框架及新范式，为开发者提供前瞻性的技术视角。',
        date: '2025-02-20',
        viewCount: 450,
        commentCount: 85,
        tags: ['趋势', '前端'],
        category: '技术',
        cover: getImageUrl(800, 400, 4),
      },
    ];

    const categories = ['技术', '生活', '杂谈', '读书笔记', '项目分享'];
    const tags = ['Vue', 'React', 'TypeScript', 'JavaScript', '前端架构', 'Node.js', '性能优化', '设计模式', '前端工程化', 'UI/UX'];

    // 计算属性：根据当前选中的标签显示不同的文章列表
    const displayArticles = computed(() => {
      return activeTab.value === 'latest' ? latestArticles : hotArticles;
    });

    // 博主数据统计
    const articleCount = ref(42);  // 模拟文章总数
    const categoryCount = computed(() => categories.length);
    const tagCount = computed(() => tags.length);

    // 方法：滚动到内容区域
    const scrollToContent = () => {
      if (contentRef.value) {
        contentRef.value.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // 方法：处理搜索
    const handleSearch = () => {
      if (searchKeyword.value.trim()) {
        router.push({
          name: 'Search',
          query: { keyword: searchKeyword.value }
        });
      }
    };

    // 方法：获取分类样式
    const getCategoryStyle = (index) => {
      const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'];
      return {
        color: colors[index % colors.length]
      };
    };

    // 方法：获取随机标签类型
    const getRandomTagType = () => {
      const types = ['', 'success', 'warning', 'danger', 'info'];
      return types[Math.floor(Math.random() * types.length)];
    };

    return {
      contentRef,
      activeTab,
      searchKeyword,
      latestArticles,
      hotArticles,
      categories,
      tags,
      displayArticles,
      articleCount,
      categoryCount,
      tagCount,
      scrollToContent,
      handleSearch,
      getCategoryStyle,
      getRandomTagType,
      getImageUrl
    };
  },
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
