import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bulma'
import '@/assets/tailwind.css'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/app.sass'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
