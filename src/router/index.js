import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  // 登录页
    { path: '/login', component: () => import('@/view/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/view/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        { path: '/article/manage', component: () => import('@/view/article/ArticleManage.vue') },
        { path: '/article/channel', component: () => import('@/view/article/ArticleChannel.vue') },
        { path: '/user/profile', component: () => import('@/view/user/UserProfile.vue') },
        { path: '/user/avatar', component: () => import('@/view/user/UserAvatar.vue') },
        { path: '/user/password', component: () => import('@/view/user/UserPassword.vue') },
      ]
    }
  ],
})

 router.beforeEach((to) => {
   const useStore = useUserStore()
   if (!useStore.token && to.path !== '/login') {
     return '/login'
   }
 })

export default router
