<template>
  <div class="article-detail">
    <h1 class="article-title">{{ article.title }}</h1>
    <div class="article-meta">
      <span class="meta-item">
        <el-icon>
          <Calendar />
        </el-icon>
        <span>{{ formatDate(article.date) }}</span>
      </span>
      <span class="meta-item">
        <el-icon>
          <View />
        </el-icon>
        <span>{{ article.viewCount }} 阅读</span>
      </span>
      <span class="meta-item">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span>{{ article.commentCount }} 评论</span>
      </span>
      <span class="meta-item category">
        <el-icon>
          <Folder />
        </el-icon>
        <span>{{ article.category }}</span>
      </span>
    </div>
    <div class="article-tags">
      <el-tag v-for="tag in article.tags" :key="tag" size="small">{{ tag }}</el-tag>
    </div>
    <div class="article-content">
      <viewer :value="article.content" :plugins="config.plugins" />
    </div>
  </div>
</template>

<script lang="ts">
import { createMarkdownConfig } from '@/utils/markdown'
import { Viewer } from '@bytemd/vue-next'
import { Calendar, ChatDotRound, Folder, View } from '@element-plus/icons-vue'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

interface Article {
  id: number;
  title: string;
  date: string;
  viewCount: number;
  commentCount: number;
  category: string;
  tags: string[];
  content: string;
}

export default defineComponent({
  name: 'ArticleDetail',
  components: {
    Viewer,
    Calendar,
    View,
    ChatDotRound,
    Folder
  },
  setup() {
    const route = useRoute()
    const article = ref<Article>({
      id: 1,
      title: '示例文章标题',
      date: '2025-03-10',
      viewCount: 100,
      commentCount: 20,
      category: '技术',
      tags: ['Vue', 'JavaScript'],
      content: `
# Hello ByteMD!

这是一篇示例文章内容。

## 代码示例

\`\`\`javascript
const app = createApp(App);
app.use(router);
app.mount('#app');
\`\`\`
      `,
    })

    const config = createMarkdownConfig()

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    onMounted(() => {
      // 在实际应用中，您会在这里根据 route.params.id 获取文章详情
      console.log('Article ID:', route.params.id)
    })

    return {
      article,
      config,
      formatDate,
    }
  },
})
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.article-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item .el-icon {
  font-size: 1.1em;
}

.category {
  color: #42b983;
}

.article-tags {
  margin-bottom: 2rem;
}

.article-tags .el-tag {
  margin-right: 8px;
}

.article-content {
  line-height: 1.8;
  color: #333;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:deep(.markdown-body) {
  background-color: transparent;
}

:deep(.markdown-body pre) {
  background-color: #f6f8fa;
}

@media (max-width: 768px) {
  .article-detail {
    padding: 15px;
  }

  .article-title {
    font-size: 1.5rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
