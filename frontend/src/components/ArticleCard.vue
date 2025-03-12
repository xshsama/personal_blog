<template>
  <div class="article-card" @click="navigateToArticle">
    <div class="article-cover">
      <img :src="article.cover || defaultCover" :alt="article.title" />
      <div class="article-category" :style="{ backgroundColor: getCategoryColor(article.category) }">
        <el-icon><Folder /></el-icon>
        {{ article.category }}
      </div>
      <div class="article-date" :title="fullDate">
        {{ formatDate(article.date) }}
      </div>
    </div>

    <div class="article-content">
      <h3 class="article-title">{{ article.title }}</h3>
      <p class="article-summary">{{ article.summary }}</p>
      
      <div class="article-footer">
        <div class="article-meta">
          <div class="meta-item" title="阅读数">
            <el-icon><View /></el-icon>
            <span>{{ formatNumber(article.viewCount) }}</span>
          </div>
          <div class="meta-item" title="评论数">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ formatNumber(article.commentCount) }}</span>
          </div>
        </div>

        <div class="article-tags">
          <el-tag 
            v-for="(tag, index) in displayTags" 
            :key="index" 
            size="small"
            effect="plain"
            class="tag"
          >
            {{ tag }}
          </el-tag>
          <el-tag 
            v-if="article.tags && article.tags.length > maxTagsToShow"
            size="small"
            type="info"
            effect="plain"
            class="tag-more"
          >
            +{{ article.tags.length - maxTagsToShow }}
          </el-tag>
        </div>
      </div>
    </div>
    
    <div class="card-hover-effect"></div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Folder, View, ChatDotRound } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'ArticleCard',
  components: {
    Folder,
    View,
    ChatDotRound
  },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const defaultCover = '#';
    const maxTagsToShow = 2;

    // 计算属性：只显示限制数量的标签
    const displayTags = computed(() => {
      if (!props.article.tags || !props.article.tags.length) return [];
      return props.article.tags.slice(0, maxTagsToShow);
    });
    
    // 计算属性：完整日期（用于标题提示）
    const fullDate = computed(() => {
      const date = new Date(props.article.date);
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      });
    });

    // 方法：导航到文章详情页
    const navigateToArticle = () => {
      router.push({ name: 'ArticleDetail', params: { id: props.article.id } });
    };

    // 方法：格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}.${date.getDate()}`;
    };
    
    // 方法：格式化数字（大于1000显示为1k+）
    const formatNumber = (num) => {
      return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
    };
    
    // 方法：根据分类名获取颜色
    const getCategoryColor = (category) => {
      const categoryColors = {
        '技术': 'rgba(64, 158, 255, 0.9)',
        '生活': 'rgba(103, 194, 58, 0.9)',
        '杂谈': 'rgba(230, 162, 60, 0.9)',
        '读书笔记': 'rgba(245, 108, 108, 0.9)',
        '项目分享': 'rgba(144, 147, 153, 0.9)'
      };
      
      return categoryColors[category] || 'rgba(66, 185, 131, 0.9)';
    };

    return {
      defaultCover,
      maxTagsToShow,
      displayTags,
      fullDate,
      navigateToArticle,
      formatDate,
      formatNumber,
      getCategoryColor
    };
  },
});
</script>

<style scoped>
.article-card {
  position: relative;
  height: 380px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.article-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.article-card:hover .article-cover img {
  transform: scale(1.08);
}

.article-category {
  position: absolute;
  top: 15px;
  left: 15px;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.article-date {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  z-index: 2;
}

.article-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  z-index: 2;
}

.article-title {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  transition: color 0.3s;
}

.article-card:hover .article-title {
  color: #409EFF;
}

.article-summary {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  flex-grow: 1;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #888;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.tag {
  transition: all 0.3s;
  font-size: 0.75rem;
  border: none;
}

.tag-more {
  font-size: 0.75rem;
  opacity: 0.7;
  border: none;
}

.tag:hover {
  transform: scale(1.05);
}

.card-hover-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #409EFF, #67C23A, #E6A23C, #F56C6C);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
  z-index: 3;
}

.article-card:hover .card-hover-effect {
  transform: scaleX(1);
}

@media (max-width: 768px) {
  .article-card {
    height: 350px;
  }
  
  .article-cover {
    height: 180px;
  }
  
  .article-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .article-tags {
    justify-content: flex-start;
  }
}

@media (max-width: 576px) {
  .article-card {
    height: auto;
  }
  
  .article-cover {
    height: 160px;
  }
  
  .article-title {
    font-size: 1.15rem;
  }
  
  .article-summary {
    -webkit-line-clamp: 2;
    margin-bottom: 10px;
  }
  
  .article-content {
    padding: 15px;
  }
}
</style>
