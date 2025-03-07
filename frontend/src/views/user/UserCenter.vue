<template>
  <div class="user-center-container">
    <el-row :gutter="20">
      <!-- 左侧导航菜单 -->
      <el-col :span="6">
        <div class="user-info-card">
          <el-avatar :size="80" src="https://placeholder.co/200">
            <el-icon><UserFilled /></el-icon>
          </el-avatar>
          <h3 class="username">用户昵称</h3>
          <p class="bio">这里是个人简介...</p>
          <el-button type="primary" @click="handleEditProfile">
            编辑资料
          </el-button>
        </div>

        <el-menu
          :default-active="activeMenu"
          class="user-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="profile">
            <el-icon><User /></el-icon>
            <span>个人资料</span>
          </el-menu-item>
          <el-menu-item index="articles">
            <el-icon><Document /></el-icon>
            <span>我的文章</span>
          </el-menu-item>
          <el-menu-item index="comments">
            <el-icon><ChatRound /></el-icon>
            <span>我的评论</span>
          </el-menu-item>
          <el-menu-item index="collections">
            <el-icon><Star /></el-icon>
            <span>我的收藏</span>
          </el-menu-item>
          <el-menu-item index="notifications">
            <el-icon><Bell /></el-icon>
            <span>消息通知</span>
            <el-badge :value="5" class="notification-badge" />
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon><Setting /></el-icon>
            <span>账号设置</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <!-- 右侧内容区 -->
      <el-col :span="18">
        <!-- 个人资料 -->
        <el-card v-if="activeMenu === 'profile'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>个人资料</span>
              <el-button type="primary" link @click="handleEditProfile">
                编辑
              </el-button>
            </div>
          </template>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">
              username123
            </el-descriptions-item>
            <el-descriptions-item label="昵称">
              用户昵称
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              example@example.com
            </el-descriptions-item>
            <el-descriptions-item label="注册时间">
              2025-01-01
            </el-descriptions-item>
            <el-descriptions-item label="个人网站">
              https://example.com
            </el-descriptions-item>
            <el-descriptions-item label="所在地">
              城市名称
            </el-descriptions-item>
            <el-descriptions-item label="个人简介" :span="2">
              这里是个人简介内容...
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 我的文章 -->
        <el-card v-if="activeMenu === 'articles'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>我的文章</span>
              <el-button type="primary" @click="handleNewArticle">
                写文章
              </el-button>
            </div>
          </template>

          <el-tabs v-model="articleTab">
            <el-tab-pane label="已发布" name="published">
              <div class="article-list">
                <div v-for="i in 5" :key="i" class="article-item">
                  <h4 class="article-title">
                    <router-link :to="`/articles/${i}`">
                      文章标题 {{ i }}
                    </router-link>
                  </h4>
                  <div class="article-meta">
                    <span>
                      <el-icon><Calendar /></el-icon>
                      2025-03-{{ i }}
                    </span>
                    <span>
                      <el-icon><View /></el-icon>
                      {{ 100 * i }}
                    </span>
                    <span>
                      <el-icon><ChatRound /></el-icon>
                      {{ 10 * i }}
                    </span>
                  </div>
                  <div class="article-actions">
                    <el-button type="primary" link @click="handleEditArticle(i)">
                      编辑
                    </el-button>
                    <el-button type="danger" link @click="handleDeleteArticle(i)">
                      删除
                    </el-button>
                  </div>
                </div>
              </div>
              <div class="pagination">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="50"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="草稿箱" name="draft">
              <!-- 草稿箱内容 -->
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <!-- 我的评论 -->
        <el-card v-if="activeMenu === 'comments'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>我的评论</span>
            </div>
          </template>

          <div class="comment-list">
            <div v-for="i in 5" :key="i" class="comment-item">
              <div class="comment-content">
                在文章《文章标题 {{ i }}》中评论：
                <p class="comment-text">
                  这是评论内容，评论内容可能会很长...
                </p>
              </div>
              <div class="comment-meta">
                <span>2025-03-{{ i }}</span>
                <div class="comment-actions">
                  <el-button type="primary" link @click="handleEditComment(i)">
                    编辑
                  </el-button>
                  <el-button type="danger" link @click="handleDeleteComment(i)">
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="50"
            />
          </div>
        </el-card>

        <!-- 我的收藏 -->
        <el-card v-if="activeMenu === 'collections'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>我的收藏</span>
            </div>
          </template>

          <el-tabs v-model="collectTab">
            <el-tab-pane label="文章" name="articles">
              <div class="collection-list">
                <div v-for="i in 5" :key="i" class="collection-item">
                  <router-link :to="`/articles/${i}`" class="article-link">
                    收藏的文章标题 {{ i }}
                  </router-link>
                  <div class="collection-meta">
                    <span>收藏于 2025-03-{{ i }}</span>
                    <el-button type="danger" link @click="handleRemoveCollection(i)">
                      取消收藏
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="标签" name="tags">
              <!-- 标签收藏内容 -->
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <!-- 消息通知 -->
        <el-card v-if="activeMenu === 'notifications'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>消息通知</span>
              <el-button type="primary" link @click="handleReadAll">
                全部已读
              </el-button>
            </div>
          </template>

          <el-tabs v-model="notificationTab">
            <el-tab-pane label="未读消息" name="unread">
              <div class="notification-list">
                <div v-for="i in 5" :key="i" class="notification-item unread">
                  <el-icon class="notification-icon"><Bell /></el-icon>
                  <div class="notification-content">
                    <p class="notification-text">
                      这是一条未读通知消息...
                    </p>
                    <span class="notification-time">2025-03-{{ i }}</span>
                  </div>
                  <el-button type="primary" link @click="handleReadNotification(i)">
                    标记已读
                  </el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="全部消息" name="all">
              <!-- 全部消息内容 -->
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <!-- 账号设置 -->
        <el-card v-if="activeMenu === 'settings'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>账号设置</span>
            </div>
          </template>

          <el-tabs v-model="settingsTab">
            <el-tab-pane label="基本设置" name="basic">
              <el-form
                :model="settingsForm"
                label-width="100px"
                class="settings-form"
              >
                <el-form-item label="头像">
                  <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="handleAvatarChange"
                  >
                    <el-avatar v-if="settingsForm.avatar" :src="settingsForm.avatar" :size="100" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                  </el-upload>
                </el-form-item>

                <el-form-item label="昵称">
                  <el-input v-model="settingsForm.nickname" />
                </el-form-item>

                <el-form-item label="个人简介">
                  <el-input
                    v-model="settingsForm.bio"
                    type="textarea"
                    :rows="4"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="handleSaveSettings">
                    保存修改
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="安全设置" name="security">
              <el-form
                :model="securityForm"
                label-width="100px"
                class="settings-form"
              >
                <el-form-item label="当前密码">
                  <el-input
                    v-model="securityForm.currentPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>

                <el-form-item label="新密码">
                  <el-input
                    v-model="securityForm.newPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>

                <el-form-item label="确认密码">
                  <el-input
                    v-model="securityForm.confirmPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="handleChangePassword">
                    修改密码
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <!-- 个人资料编辑对话框 -->
    <el-dialog
      v-model="profileDialogVisible"
      title="编辑个人资料"
      width="50%"
    >
      <el-form
        :model="profileForm"
        label-width="100px"
      >
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
          >
            <el-avatar v-if="profileForm.avatar" :src="profileForm.avatar" :size="100" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="profileForm.nickname" />
        </el-form-item>

        <el-form-item label="个人网站">
          <el-input v-model="profileForm.website" />
        </el-form-item>

        <el-form-item label="所在地">
          <el-input v-model="profileForm.location" />
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input
            v-model="profileForm.bio"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="profileDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveProfile">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserFilled,
  User,
  Document,
  ChatRound,
  Star,
  Bell,
  Setting,
  Calendar,
  View,
  Plus,
  Lock
} from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = ref('profile')
const articleTab = ref('published')
const collectTab = ref('articles')
const notificationTab = ref('unread')
const settingsTab = ref('basic')

const profileDialogVisible = ref(false)
const profileForm = ref({
  avatar: '',
  nickname: '',
  website: '',
  location: '',
  bio: ''
})

const settingsForm = ref({
  avatar: '',
  nickname: '',
  bio: ''
})

const securityForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleMenuSelect = (key: string) => {
  activeMenu.value = key
}

const handleEditProfile = () => {
  profileDialogVisible.value = true
}

const handleSaveProfile = () => {
  // TODO: 保存个人资料
  profileDialogVisible.value = false
}

const handleAvatarChange = (file: any) => {
  // TODO: 处理头像上传
  console.log('上传头像:', file)
}

const handleNewArticle = () => {
  router.push('/editor')
}

const handleEditArticle = (id: number) => {
  router.push(`/editor/${id}`)
}

const handleDeleteArticle = (id: number) => {
  // TODO: 删除文章
  console.log('删除文章:', id)
}

const handleEditComment = (id: number) => {
  // TODO: 编辑评论
  console.log('编辑评论:', id)
}

const handleDeleteComment = (id: number) => {
  // TODO: 删除评论
  console.log('删除评论:', id)
}

const handleRemoveCollection = (id: number) => {
  // TODO: 取消收藏
  console.log('取消收藏:', id)
}

const handleReadAll = () => {
  // TODO: 标记所有消息为已读
  console.log('全部已读')
}

const handleReadNotification = (id: number) => {
  // TODO: 标记消息为已读
  console.log('标记已读:', id)
}

const handleSaveSettings = () => {
  // TODO: 保存基本设置
  console.log('保存设置:', settingsForm.value)
}

const handleChangePassword = () => {
  // TODO: 修改密码
  console.log('修改密码:', securityForm.value)
}
</script>

<style scoped>
.user-center-container {
  padding: 20px;
}

.user-info-card {
  background: #fff;
  padding: 24px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.username {
  margin: 12px 0 8px;
  font-size: 18px;
  color: #303133;
}

.bio {
  color: #909399;
  font-size: 14px;
  margin: 0 0 16px;
}

.user-menu {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.notification-badge {
  margin-left: 8px;
}

.content-card {
  min-height: 500px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-list,
.comment-list,
.collection-list,
.notification-list {
  margin-bottom: 24px;
}

.article-item,
.comment-item,
.collection-item,
.notification-item {
  padding: 16px 0;
  border-bottom: 1px solid #EBEEF5;
}

.article-item:last-child,
.comment-item:last-child,
.collection-item:last-child,
.notification-item:last-child {
  border-bottom: none;
}

.article-title {
  margin: 0 0 8px;
  font-size: 16px;
}

.article-title a {
  color: #303133;
  text-decoration: none;
}

.article-title a:hover {
  color: #409EFF;
}

.article-meta,
.comment-meta,
.collection-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #909399;
  font-size: 14px;
}

.article-meta span,
.comment-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-actions,
.comment-actions {
  margin-top: 8px;
}

.comment-text {
  margin: 8px 0;
  color: #606266;
}

.article-link {
  color: #303133;
  text-decoration: none;
  font-size: 16px;
}

.article-link:hover {
  color: #409EFF;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
}

.notification-item.unread {
  background-color: #f5f7fa;
}

.notification-icon {
  color: #409EFF;
  font-size: 20px;
}

.notification-content {
  flex: 1;
}

.notification-text {
  margin: 0 0 4px;
  color: #303133;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.settings-form {
  max-width: 500px;
}

.avatar-uploader {
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
