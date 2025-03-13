import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home/index.vue'),
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('../views/Article/list.vue'),
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('../views/Article/detail.vue'),
  },
  {
    path: '/categories',
    name: 'CategoryList',
    component: () => import('../views/Category/list.vue'),
  },
  {
    path: '/tags',
    name: 'TagList',
    component: () => import('../views/Tag/list.vue'),
  },
  {
    path: '/archives',
    name: 'ArchiveList',
    component: () => import('../views/Archive/list.vue'),
    alias: '/archive',
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search/index.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Auth/login.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Auth/register.vue'),
    meta: { guest: true },
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: () => import('../views/User/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta.guest)
  const isAuthenticated = localStorage.getItem('token')

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (guestOnly && isAuthenticated) {
    next('/user')
  } else {
    next()
  }
})

export default router
