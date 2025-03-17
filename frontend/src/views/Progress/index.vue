<template>
    <div class="progress-page">
        <div class="page-header">
            <h1>博客建设进度</h1>
            <p class="subtitle">记录网站开发过程中的点点滴滴</p>
        </div>

        <div class="progress-content">
            <!-- 总体进度 -->
            <el-card class="progress-card">
                <template #header>
                    <div class="card-header">
                        <span>总体完成进度</span>
                        <el-progress type="dashboard" :percentage="68" :color="progressColors"></el-progress>
                    </div>
                </template>
                <p class="progress-description">
                    目前已完成基础功能开发，正在进行功能优化和新特性开发。
                </p>
            </el-card>

            <!-- 功能模块进度 -->
            <el-card class="module-card">
                <template #header>
                    <div class="card-header">
                        <span>功能模块进度</span>
                    </div>
                </template>
                <el-timeline>
                    <el-timeline-item v-for="(module, index) in modules" :key="index"
                        :type="module.status === 'completed' ? 'success' : module.status === 'in-progress' ? 'primary' : 'info'"
                        :hollow="module.status === 'planned'" :timestamp="module.timestamp">
                        <el-card class="timeline-card">
                            <h4>{{ module.name }}</h4>
                            <p>{{ module.description }}</p>
                            <div class="module-progress">
                                <el-progress :percentage="module.progress"
                                    :status="module.status === 'completed' ? 'success' : undefined"></el-progress>
                            </div>
                            <div class="module-features">
                                <el-tag v-for="(feature, fidx) in module.features" :key="fidx"
                                    :type="feature.done ? 'success' : ''" :effect="feature.done ? 'light' : 'plain'"
                                    size="small" class="feature-tag">
                                    {{ feature.name }}
                                </el-tag>
                            </div>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-card>

            <!-- 更新日志 -->
            <el-card class="changelog-card">
                <template #header>
                    <div class="card-header">
                        <span>更新日志</span>
                    </div>
                </template>
                <el-timeline>
                    <el-timeline-item v-for="(log, index) in changelog" :key="index" :timestamp="log.date"
                        placement="top" :type="log.type">
                        <h4>{{ log.title }}</h4>
                        <p>{{ log.content }}</p>
                    </el-timeline-item>
                </el-timeline>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProgressPage',
    setup() {
        const progressColors = [
            { color: '#f56c6c', percentage: 20 },
            { color: '#e6a23c', percentage: 40 },
            { color: '#5cb87a', percentage: 60 },
            { color: '#1989fa', percentage: 80 },
            { color: '#6f7ad3', percentage: 100 }
        ]

        const modules = [
            {
                name: '用户系统',
                description: '包含用户注册、登录、密码重置等基础功能',
                timestamp: '2024-03',
                status: 'completed',
                progress: 100,
                features: [
                    { name: '用户注册', done: true },
                    { name: '用户登录', done: true },
                    { name: '密码重置', done: false }
                ]
            },
            {
                name: '文章系统',
                description: '文章的创建、编辑、发布、删除等核心功能',
                timestamp: '2024-03',
                status: 'in-progress',
                progress: 70,
                features: [
                    { name: '文章创建', done: true },
                    { name: '文章编辑', done: true },
                    { name: 'Markdown支持', done: true },
                    { name: '文章删除', done: false },
                    { name: '草稿功能', done: false }
                ]
            },
            {
                name: '评论系统',
                description: '文章评论、回复功能',
                timestamp: '2024-04',
                status: 'planned',
                progress: 0,
                features: [
                    { name: '评论发布', done: false },
                    { name: '评论回复', done: false },
                    { name: '评论管理', done: false }
                ]
            }
        ]

        const changelog = [
            {
                date: '2024-03-15',
                title: 'v0.2.0 发布',
                content: '完成文章创建和编辑功能，支持Markdown编辑器',
                type: 'success'
            },
            {
                date: '2024-03-10',
                title: 'v0.1.1 更新',
                content: '修复用户登录状态保存问题，优化页面响应式布局',
                type: 'warning'
            },
            {
                date: '2024-03-01',
                title: 'v0.1.0 发布',
                content: '完成用户注册和登录功能，搭建基础项目框架',
                type: 'primary'
            }
        ]

        return {
            progressColors,
            modules,
            changelog
        }
    }
}
</script>

<style scoped>
.progress-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.page-header {
    text-align: center;
    margin-bottom: 40px;
}

.page-header h1 {
    font-size: 2.5rem;
    color: #303133;
    margin-bottom: 10px;
}

.subtitle {
    color: #909399;
    font-size: 1.1rem;
}

.progress-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.progress-card,
.module-card,
.changelog-card {
    margin-bottom: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.progress-description {
    color: #606266;
    text-align: center;
    margin-top: 20px;
}

.timeline-card {
    margin-bottom: 10px;
}

.timeline-card h4 {
    margin: 0;
    margin-bottom: 10px;
    color: #303133;
}

.timeline-card p {
    color: #606266;
    font-size: 14px;
    margin: 0;
    margin-bottom: 15px;
}

.module-progress {
    margin: 15px 0;
}

.module-features {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.feature-tag {
    border-radius: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .progress-page {
        padding: 10px;
    }

    .page-header h1 {
        font-size: 2rem;
    }

    .card-header {
        flex-direction: column;
        gap: 15px;
    }
}
</style>