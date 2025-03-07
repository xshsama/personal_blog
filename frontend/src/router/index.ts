import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import ArticleList from '@/views/articles/ArticleList.vue'
import ArticleDetail from '@/views/articles/ArticleDetail.vue'
import CategoryList from '@/views/categories/CategoryList.vue'
import TagList from '@/views/tags/TagList.vue'
import ArchiveList from '@/views/archives/ArchiveList.vue'
import SearchResult from '@/views/search/SearchResult.vue'
import AboutView from '@/views/about/AboutView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import UserCenter from '@/views/user/UserCenter.vue'
import ArticleEditor from '@/views/editor/ArticleEditor.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guest?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/layout/BasicLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView
      },
      {
        path: 'articles',
        name: 'articles',
        component: ArticleList
      },
      {
        path: 'articles/:id',
        name: 'article-detail',
        component: ArticleDetail,
        props: true
      },
      {
        path: 'categories',
        name: 'categories',
        component: CategoryList
      },
      {
        path: 'tags',
        name: 'tags',
        component: TagList
      },
      {
        path: 'archives',
        name: 'archives',
        component: ArchiveList
      },
      {
        path: 'search',
        name: 'search',
        component: SearchResult
      },
      {
        path: 'about',
        name: 'about',
        component: AboutView
      },
      {
        path: 'user',
        name: 'user',
        component: UserCenter,
        meta: { requiresAuth: true }
      },
      {
        path: 'editor',
        name: 'editor-create',
        component: ArticleEditor,
        meta: { requiresAuth: true }
      },
      {
        path: 'editor/:id',
        name: 'editor-edit',
        component: ArticleEditor,
        props: true,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') // 简单的身份验证检查
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 需要登录但未登录，重定向到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (to.meta.guest && isAuthenticated) {
    // 已登录用户访问登录/注册页，重定向到首页
    next('/')
  } else {
    next()
  }
})

export default router
