<template>
  <div class="article-detail">
    <h1 class="article-title">{{ article.title }}</h1>
    <div class="article-meta">
      <span class="meta-item">
        <i class="far fa-calendar-alt"></i>
        <span>{{ formatDate(article.date) }}</span>
      </span>
      <span class="meta-item">
        <i class="far fa-eye"></i>
        <span>{{ article.viewCount }} 阅读</span>
      </span>
      <span class="meta-item">
        <i class="far fa-comment"></i>
        <span>{{ article.commentCount }} 评论</span>
      </span>
      <span class="meta-item category">
        <i class="far fa-folder"></i>
        <span>{{ article.category }}</span>
      </span>
    </div>
    <div class="article-tags">
      <el-tag v-for="tag in article.tags" :key="tag" size="small">{{ tag }}</el-tag>
    </div>
    <div class="article-content" v-html="article.content"></div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'ArticleDetail',
  setup() {
    const route = useRoute();
    const article = ref({
      id: 1,
      title: '示例文章标题',
      date: '2025-03-10',
      viewCount: 100,
      commentCount: 20,
      category: '技术',
      tags: ['Vue', 'JavaScript'],
      content: `
        <p>这是一篇示例文章内容。</p>
        <p>这里是第二段落，您可以在这里看到文章的详细内容。</p>
        <h2>副标题</h2>
        <p>这是副标题下的内容，您可以在这里看到更多的文章详情。</p>
        <pre><code>// 这是一段代码示例
const app = createApp(App);
app.use(router);
app.mount('#app');</code></pre>
      `,
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    onMounted(() => {
      // 在实际应用中，您会在这里根据 route.params.id 获取文章详情
      console.log('Article ID:', route.params.id);
    });

    return {
      article,
      formatDate,
    };
  },
});
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
}

.meta-item i {
  margin-right: 5px;
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
}

.article-content h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
}

.article-content p {
  margin-bottom: 1rem;
}

.article-content pre {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
}

.article-content code {
  font-family: 'Courier New', Courier, monospace;
}
</style>
