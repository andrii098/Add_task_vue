import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/todo-list.vue')
    },
    {
      path: '/in-progress',
      name: 'in-progress',
      props: { filter: 'in-progress' },
      component: () => import('../views/todo-list.vue')
    },
    {
      path: '/completed',
      name: 'completed',
      props: { filter: 'completed' },
      component: () => import('../views/todo-list.vue')
    },
    {
      path: '/canceled',
      name: 'canceled',
      props: { filter: 'canceled' },
      component: () => import('../views/todo-list.vue')
    }
  ]
})

export default router