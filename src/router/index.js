import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Setting',
    component: () => import('@/views/Setting')
  },
  {
    path: '/backup',
    name: 'Backup',
    component: () => import('@/views/Backup')
  },
  {
    path: '/restore',
    name: 'Restore',
    component: () => import('@/views/Restore')
  },
  {
    path: '/select-google-drive-folder',
    name: 'SelectGoogleDriveFolder',
    component: () => import('@/views/SelectGoogleDriveFolder')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
