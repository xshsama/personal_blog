<template>
    <div class="right-menu">
        <el-button type="primary" @click="handleWriteClick">写文章</el-button>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
    name: 'NavBar',
    setup() {
        const router = useRouter()
        const store = useStore()

        const handleWriteClick = () => {
            if (!store.getters['auth/isAuthenticated']) {
                ElMessage({
                    message: '请先登录后再写文章',
                    type: 'warning'
                })
                return
            }
            router.push({ name: 'ArticleCreate' })
        }

        return {
            handleWriteClick
        }
    }
}
</script>

<style scoped>
.right-menu {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>
