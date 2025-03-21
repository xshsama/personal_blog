<template>
  <el-card class="article-card" :body-style="{ padding: '0' }" @click="$emit('click')">
    <div class="article-cover">
      <img :src="article.coverImage || defaultCover" :alt="article.title">
      <div class="article-meta-overlay">
        <span class="meta-item">
          <el-icon>
            <Calendar />
          </el-icon>
          {{ formatDate(article.createdAt) }}
        </span>
        <span class="meta-item">
          <el-icon>
            <View />
          </el-icon>
          {{ formatNumber(article.viewCount) }}
        </span>
        <span class="meta-item">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          {{ formatNumber(article.commentCount) }}
        </span>
      </div>
    </div>
    <div class="article-content">
      <div class="article-category" :style="{ backgroundColor: getCategoryColor(article.category) }">
        <el-icon>
          <Folder />
        </el-icon>
        {{ article.category }}
      </div>
      <h3 class="article-title">{{ article.title }}</h3>
      <p class="article-summary">{{ article.summary }}</p>
      <div class="article-tags">
        <el-tag v-for="tag in displayTags" :key="tag" size="small" effect="plain">
          {{ tag }}
        </el-tag>
        <el-tag v-if="article.tags && article.tags.length > maxTagsToShow" size="small" effect="plain" type="info">
          +{{ article.tags.length - maxTagsToShow }}
        </el-tag>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Article } from '@/types/article'
import { Calendar, ChatDotRound, Folder, View } from '@element-plus/icons-vue'
import { computed, defineComponent, PropType } from 'vue'

interface CategoryColors {
  [key: string]: string
}

export default defineComponent({
  name: 'ArticleCard',
  components: {
    Calendar,
    View,
    ChatDotRound,
    Folder
  },
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true
    }
  },
  emits: ['click'],
  setup(props) {
    const defaultCover = 'https://via.placeholder.com/800x400'
    const maxTagsToShow = 2

    const displayTags = computed(() => {
      if (!props.article.tags || !props.article.tags.length) return []
      return props.article.tags.slice(0, maxTagsToShow)
    })

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString)
      return `${date.getMonth() + 1}.${date.getDate()}`
    }

    const formatNumber = (num: number): string | number => {
      return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
    }

    const getCategoryColor = (category: string): string => {
      const categoryColors: CategoryColors = {
        '前端': 'var(--el-color-primary)',
        '后端': 'var(--el-color-success)',
        'DevOps': 'var(--el-color-warning)',
        '数据库': 'var(--el-color-danger)',
        '移动开发': 'var(--el-color-info)',
        '机器学习': 'var(--el-color-purple)'
      }

      return categoryColors[category] || 'var(--el-color-info)'
    }

    return {
      defaultCover,
      maxTagsToShow,
      displayTags,
      formatDate,
      formatNumber,
      getCategoryColor
    }
  }
})
</script>

<style scoped>
.article-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-5px);
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
  transition: transform 0.3s ease;
}

.article-card:hover .article-cover img {
  transform: scale(1.05);
}

.article-meta-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  display: flex;
  gap: 15px;
  font-size: 0.9em;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-content {
  padding: 16px;
  position: relative;
}

.article-category {
  position: absolute;
  top: -12px;
  right: 16px;
  padding: 4px 12px;
  border-radius: 16px;
  color: white;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-title {
  margin: 8px 0;
  font-size: 1.2em;
  color: var(--el-text-color-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.article-summary {
  color: var(--el-text-color-regular);
  font-size: 0.9em;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.el-tag) {
  text-transform: capitalize;
}
</style>
