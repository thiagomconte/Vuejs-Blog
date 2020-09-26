import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import CreatePost from '../views/CreatePost.vue'
import Home from '../views/Home.vue'
import EditPost from '../views/EditPost.vue'
import Post from '../views/Post.vue'
import Admin from '../views/Admin.vue'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/admin',
    name: 'Admin',
    component: Admin,
    meta:{
      requiresAdmin: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      requiresGuest: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      requiresGuest: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/createpost',
    name: 'CreatePost',
    component: CreatePost,
    meta:{
      requiresAdmin: true
    }
  },
  {
    path: '/editpost',
    name: 'EditPost',
    component: EditPost,
    props(route){
      return { slug: route.query.slug}
    },
    meta:{
      requiresAdmin: true
    }
  },
  {
    path: '/post',
    name: 'Post',
    component: Post,
    props(route){
      return { slug: route.query.slug}
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
  if(to.matched.some(record => record.meta.requiresGuest)) {
    if (!store.getters.isLoggedIn) {
      next()
      return
    }
    next('/profile') 
  } else {
    next() 
  }
  if(to.matched.some(record => record.meta.requiresAdmin)) {
    if (store.getters.isAdmin) {
      next()
      return
    }
    next('/')
  } else {
    next() 
  }
})

export default router
