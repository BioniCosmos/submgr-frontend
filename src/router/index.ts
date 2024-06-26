import { useAccount } from '@/type/account'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sign-up',
      component: () => import('@/views/SignUpView.vue'),
    },
    {
      path: '/verification/:id?',
      component: () => import('@/views/VerificationView.vue'),
      props: true,
    },
    {
      path: '/sign-in',
      component: () => import('@/views/SignInView.vue'),
    },
    {
      path: '/',
      component: () => import('@/views/BaseView.vue'),
      meta: {
        auth: true,
      },
      children: [
        {
          path: '',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'nodes',
          component: () => import('@/views/Node/NodeView.vue'),
        },
        {
          path: 'node/:id?',
          component: () => import('@/views/Node/NodeEditorView.vue'),
          props: true,
        },
        {
          path: 'profile',
          component: () => import('@/views/ProfileEditorView.vue'),
          beforeEnter: (to, from) => {
            if (!to.query.nodeId) {
              return from
            }
          },
        },
        {
          path: 'users',
          component: () => import('@/views/User/UserView.vue'),
        },
        {
          path: 'user',
          component: () => import('@/views/User/UserInsertView.vue'),
        },
        {
          path: 'user/:id',
          component: () => import('@/views/User/UserUpdateView.vue'),
          props: true,
        },
        {
          path: 'setting',
          component: () => import('@/views/SettingView.vue'),
          children: [
            {
              path: 'account',
              component: () => import('@/views/setting/AccountView.vue'),
            },
            {
              path: 'server',
              component: () => import('@/views/setting/ServerView.vue'),
            },
            {
              path: 'smtp',
              component: () => import('@/views/setting/SMTPView.vue'),
            },
          ],
        },
      ],
    },
  ],
})

export default router

router.beforeEach((to) => {
  const account = useAccount()
  if (!['/sign-in', '/sign-up'].includes(to.path) && account.value === null) {
    return '/sign-in'
  }
  if (
    !to.path.startsWith('/verification') &&
    account.value?.status === 'unverified'
  ) {
    return '/verification'
  }
  if (!to.meta.auth && account.value?.status === 'normal') {
    return '/'
  }
})

declare module 'vue-router' {
  interface RouteMeta {
    auth?: boolean
  }
}
