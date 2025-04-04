<template>
    <div class="user-center">
        <el-card class="user-info-card">
            <div class="user-header">
                <el-avatar :size="100" :src="userInfo.avatar" />
                <h2 class="username">{{ userInfo.username }}</h2>
                <p class="bio">{{ userInfo.bio || '这个人很懒，还没有写简介' }}</p>
            </div>

            <div class="user-stats">
                <div class="stat-item">
                    <div class="stat-number">{{ userInfo.articleCount }}</div>
                    <div class="stat-label">文章</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{{ userInfo.likeCount }}</div>
                    <div class="stat-label">获赞</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{{ userInfo.commentCount }}</div>
                    <div class="stat-label">评论</div>
                </div>
            </div>

            <div class="action-buttons">
                <el-button type="primary" @click="createArticle">
                    <el-icon>
                        <EditPen />
                    </el-icon>
                    写文章
                </el-button>
                <el-button type="primary" @click="editProfile">
                    <el-icon>
                        <Edit />
                    </el-icon>
                    编辑资料
                </el-button>
                <el-button @click="handleLogout">
                    <el-icon>
                        <SwitchButton />
                    </el-icon>
                    退出登录
                </el-button>
            </div>
        </el-card>

        <el-tabs v-model="activeTab" class="user-tabs">
            <el-tab-pane label="我的文章" name="articles">
                <div class="articles-list" v-if="myArticles.length">
                    <article-card v-for="article in myArticles" :key="article.id" :article="article" />
                </div>
                <el-empty v-else description="暂无文章">
                    <el-button type="primary" @click="createArticle">立即创作</el-button>
                </el-empty>
            </el-tab-pane>

            <el-tab-pane label="收藏文章" name="favorites">
                <div class="articles-list" v-if="favoriteArticles.length">
                    <article-card v-for="article in favoriteArticles" :key="article.id" :article="article" />
                </div>
                <el-empty v-else description="暂无收藏" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { Edit, EditPen, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ArticleCard from '../../components/ArticleCard.vue'

export default defineComponent({
    name: 'UserCenter',
    components: {
        ArticleCard,
        Edit,
        EditPen,
        SwitchButton
    },
    setup() {
        const router = useRouter()
        const store = useStore()
        const activeTab = ref('articles')

        // 从 store 获取用户数据
        const userInfo = computed(() => {
            const user = store.getters['auth/currentUser']
            return {
                username: user?.username || 'User',
                bio: user?.bio || '热爱技术，热爱生活',
                avatar: user?.avatar || '#',
                articleCount: user?.articleCount || 0,
                likeCount: user?.likeCount || 0,
                commentCount: user?.commentCount || 0
            }
        })

        // 模拟文章数据，实际应该从后端获取
        const myArticles = ref([])
        const favoriteArticles = ref([])

        // 创建文章
        const createArticle = () => {
            router.push({ name: 'ArticleCreate' })
        }

        // 编辑个人资料
        const editProfile = () => {
            ElMessage.info('编辑个人资料功能开发中')
        }

        // 处理退出登录
        const handleLogout = async () => {
            try {
                await store.dispatch('auth/logout')
                ElMessage.success('已退出登录')
                router.push('/login')
            } catch (error) {
                console.error('退出登录失败:', error)
                ElMessage.error('退出登录失败，请稍后重试')
            }
        }

        return {
            activeTab,
            userInfo,
            myArticles,
            favoriteArticles,
            createArticle,
            editProfile,
            handleLogout
        }
    }
})
</script>

<style scoped>
.user-center {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.user-info-card {
    margin-bottom: 30px;
}

.user-header {
    text-align: center;
    padding: 20px 0;
}

.username {
    margin: 15px 0 5px;
    font-size: 1.5rem;
}

.bio {
    color: #666;
    margin: 5px 0;
}

.user-stats {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin: 20px 0;
    padding: 20px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 600;
    color: #409EFF;
}

.stat-label {
    color: #666;
    margin-top: 5px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.articles-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.user-tabs {
    margin-top: 30px;
}

:deep(.el-tabs__header) {
    margin-bottom: 30px;
}
</style>