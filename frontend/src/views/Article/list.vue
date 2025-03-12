<template>
  <div class="articles-page">
    <h1 class="page-title">All Articles</h1>

    <!-- Filters Section -->
    <div class="filters">
      <div class="filter-item">
        <label>Category:</label>
        <select v-model="filters.category" @change="filterArticles">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <label>Tag:</label>
        <select v-model="filters.tag" @change="filterArticles">
          <option value="">All Tags</option>
          <option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <label>Sort By:</label>
        <select v-model="filters.sortBy" @change="filterArticles">
          <option value="date_desc">Latest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="views">Most Views</option>
          <option value="comments">Most Comments</option>
        </select>
      </div>

      <div class="filter-search">
        <input type="text" v-model="filters.search" placeholder="Search articles..." @keyup.enter="filterArticles" />
        <button @click="filterArticles" class="search-btn">
          <i class="el-icon-search"></i>
        </button>
      </div>
    </div>

    <!-- Articles Grid -->
    <div class="articles-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading articles...</p>
      </div>

      <div v-else-if="filteredArticles.length === 0" class="no-articles">
        <i class="el-icon-document"></i>
        <p>No articles found matching your criteria.</p>
        <button @click="resetFilters" class="reset-btn">Reset Filters</button>
      </div>

      <div v-else class="articles-grid">
        <article-card v-for="article in filteredArticles" :key="article.id" :article="article" />
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="filteredArticles.length > 0">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="pagination-btn">
        <i class="el-icon-arrow-left"></i> Previous
      </button>

      <div class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }}
      </div>

      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" class="pagination-btn">
        Next <i class="el-icon-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import ArticleCard from '../../components/ArticleCard.vue';

export default {
  name: 'ArticlesList',
  components: {
    ArticleCard
  },
  data() {
    return {
      articles: [],
      categories: [
        { id: 1, name: 'Frontend' },
        { id: 2, name: 'Backend' },
        { id: 3, name: 'DevOps' },
        { id: 4, name: 'Database' },
        { id: 5, name: 'Mobile' },
        { id: 6, name: 'Machine Learning' }
      ],
      tags: [
        { id: 1, name: 'JavaScript' },
        { id: 2, name: 'Vue' },
        { id: 3, name: 'React' },
        { id: 4, name: 'Node.js' },
        { id: 5, name: 'TypeScript' },
        { id: 6, name: 'CSS' },
        { id: 7, name: 'HTML' },
        { id: 8, name: 'Docker' },
        { id: 9, name: 'Git' },
        { id: 10, name: 'Database' },
        { id: 11, name: 'API' },
        { id: 12, name: 'Web Development' }
      ],
      filters: {
        category: '',
        tag: '',
        sortBy: 'date_desc',
        search: ''
      },
      currentPage: 1,
      articlesPerPage: 8,
      loading: true
    };
  },
  computed: {
    filteredArticles() {
      let result = [...this.articles];

      // Apply category filter
      if (this.filters.category) {
        result = result.filter(article => {
          const categoryId = this.getCategoryId(article.category);
          return categoryId === parseInt(this.filters.category);
        });
      }

      // Apply tag filter
      if (this.filters.tag) {
        result = result.filter(article => {
          return article.tags.some(tag => {
            const tagId = this.getTagId(tag);
            return tagId === parseInt(this.filters.tag);
          });
        });
      }

      // Apply search filter
      if (this.filters.search.trim()) {
        const searchTerm = this.filters.search.toLowerCase();
        result = result.filter(article =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.summary.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      switch (this.filters.sortBy) {
        case 'date_asc':
          result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'date_desc':
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'views':
          result.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        case 'comments':
          result.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
          break;
      }

      // Apply pagination
      const startIndex = (this.currentPage - 1) * this.articlesPerPage;
      const paginatedResult = result.slice(startIndex, startIndex + this.articlesPerPage);

      return paginatedResult;
    },
    totalFilteredArticles() {
      let result = [...this.articles];

      if (this.filters.category) {
        result = result.filter(article => {
          const categoryId = this.getCategoryId(article.category);
          return categoryId === parseInt(this.filters.category);
        });
      }

      if (this.filters.tag) {
        result = result.filter(article => {
          return article.tags.some(tag => {
            const tagId = this.getTagId(tag);
            return tagId === parseInt(this.filters.tag);
          });
        });
      }

      if (this.filters.search.trim()) {
        const searchTerm = this.filters.search.toLowerCase();
        result = result.filter(article =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.summary.toLowerCase().includes(searchTerm)
        );
      }

      return result.length;
    },
    totalPages() {
      return Math.ceil(this.totalFilteredArticles / this.articlesPerPage);
    }
  },
  methods: {
    filterArticles() {
      this.currentPage = 1;
      // In a real app, you might want to trigger an API request here with the filters
    },
    resetFilters() {
      this.filters = {
        category: '',
        tag: '',
        sortBy: 'date_desc',
        search: ''
      };
      this.filterArticles();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    getCategoryId(categoryName) {
      const category = this.categories.find(cat => cat.name === categoryName);
      return category ? category.id : null;
    },
    getTagId(tagName) {
      const tag = this.tags.find(t => t.name === tagName);
      return tag ? tag.id : null;
    },
    fetchArticles() {
      // Simulating API call with setTimeout
      this.loading = true;

      setTimeout(() => {
        // Mock data
        this.articles = [
          {
            id: 1,
            title: 'Getting Started with Vue 3',
            summary: 'Learn how to set up your first Vue 3 project and explore the new Composition API.',
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2023-05-15T10:00:00',
            author: 'John Doe',
            category: 'Frontend',
            tags: ['Vue', 'JavaScript'],
            views: 1250,
            commentsCount: 8
          },
          {
            id: 2,
            title: 'RESTful API Design Best Practices',
            summary: 'Explore the key principles and best practices for designing clean and effective RESTful APIs.',
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2023-05-10T14:30:00',
            author: 'John Doe',
            category: 'Backend',
            tags: ['API', 'REST', 'Web Development'],
            views: 980,
            commentsCount: 5
          },
          {
            id: 3,
            title: 'Introduction to Docker',
            summary: 'A beginner-friendly guide to Docker containers and how they simplify application deployment.',
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2023-05-05T09:15:00',
            author: 'John Doe',
            category: 'DevOps',
            tags: ['Docker', 'Containers', 'DevOps'],
            views: 750,
            commentsCount: 3
          },
          {
            id: 4,
            title: 'Understanding CSS Grid Layout',
            summary: 'Master the CSS Grid layout system and create complex web layouts with ease.',
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2023-04-28T16:45:00',
            author: 'John Doe',
            category: 'Frontend',
            tags: ['CSS', 'Web Design'],
            views: 620,
            commentsCount: 4
          },
          {
            id: 5,
            title: 'Top 10 JavaScript Tips and Tricks',
            summary: 'Improve your JavaScript skills with these essential tips and tricks that every developer should know.',
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2023-04-15T11:20:00',
            author: 'John Doe',
            category: 'Frontend',
            tags: ['JavaScript', 'Web Development'],
            views: 1542,
            commentsCount: 12
          },
          {
            id: 6,
            title: 'Building Scalable Node.js Applications',
            summary: 'Learn how to design and build Node.js applications that can scale effectively as user demand grows.',
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2023-03-22T08:30:00',
            author: 'John Doe',
            category: 'Backend',
            tags: ['Node.js', 'JavaScript', 'Backend'],
            views: 1245,
            commentsCount: 9
          },
          {
            id: 7,
            title: 'Essential VS Code Extensions for Web Developers',
            summary: 'Boost your productivity with these must-have Visual Studio Code extensions for web development.',
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2023-02-18T14:10:00',
            author: 'John Doe',
            category: 'Tools',
            tags: ['VS Code', 'Tools', 'Web Development'],
            views: 987,
            commentsCount: 6
          },
          {
            id: 8,
            title: 'Introduction to TypeScript',
            summary: 'Get started with TypeScript and learn how it improves JavaScript development with static typing.',
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2023-01-30T09:45:00',
            author: 'John Doe',
            category: 'Frontend',
            tags: ['TypeScript', 'JavaScript'],
            views: 863,
            commentsCount: 4
          },
          {
            id: 9,
            title: 'React Hooks Explained',
            summary: 'A comprehensive guide to React Hooks and how they simplify state management in functional components.',
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2023-01-05T16:20:00',
            author: 'John Doe',
            category: 'Frontend',
            tags: ['React', 'JavaScript'],
            views: 752,
            commentsCount: 7
          },
          {
            id: 10,
            title: 'PostgreSQL vs MySQL: Which Should You Choose?',
            summary: 'Compare the features, performance, and use cases of two popular relational database management systems.',
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2022-12-20T11:30:00',
            author: 'John Doe',
            category: 'Database',
            tags: ['PostgreSQL', 'MySQL', 'Database'],
            views: 689,
            commentsCount: 5
          }
        ];

        this.loading = false;
      }, 1000);
    }
  },
  mounted() {
    this.fetchArticles();

    // Check if there are query parameters for filters
    const { category, tag, search } = this.$route.query;
    if (category) this.filters.category = category;
    if (tag) this.filters.tag = tag;
    if (search) this.filters.search = search;
  }
}
</script>

<style scoped>
.articles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

.page-title {
  font-size: 32px;
  margin-bottom: 30px;
  font-weight: 600;
  text-align: center;
}

/* Filters Section */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.filter-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.filter-item label {
  margin-right: 8px;
  font-weight: 500;
}

.filter-item select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.filter-search {
  display: flex;
  flex: 1;
  min-width: 200px;
}

.filter-search input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.search-btn {
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 12px;
  cursor: pointer;
}

/* Articles Container */
.articles-container {
  min-height: 400px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #409EFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* No Articles State */
.no-articles {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #909399;
}

.no-articles i {
  font-size: 64px;
  margin-bottom: 20px;
}

.reset-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #f5f7fa;
  color: #409EFF;
  border: 1px solid #409EFF;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover {
  background-color: #409EFF;
  color: white;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 20px;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #409EFF;
  color: white;
  border-color: #409EFF;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 20px;
  font-size: 14px;
  color: #606266;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 15px;
  }

  .filter-item {
    width: 100%;
    margin-right: 0;
  }

  .filter-item select {
    width: 100%;
  }

  .filter-search {
    width: 100%;
  }
}
</style>