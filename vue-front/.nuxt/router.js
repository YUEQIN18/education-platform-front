import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _a3530236 = () => interopDefault(import('../pages/course/index.vue' /* webpackChunkName: "pages/course/index" */))
const _b74ed21c = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _40d276ac = () => interopDefault(import('../pages/register.vue' /* webpackChunkName: "pages/register" */))
const _c2d2de24 = () => interopDefault(import('../pages/teacher/index.vue' /* webpackChunkName: "pages/teacher/index" */))
const _225e12e6 = () => interopDefault(import('../pages/course/_id.vue' /* webpackChunkName: "pages/course/_id" */))
const _67c25d09 = () => interopDefault(import('../pages/player/_vid.vue' /* webpackChunkName: "pages/player/_vid" */))
const _3a601254 = () => interopDefault(import('../pages/teacher/_id.vue' /* webpackChunkName: "pages/teacher/_id" */))
const _4a9e184a = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/course",
    component: _a3530236,
    name: "course"
  }, {
    path: "/login",
    component: _b74ed21c,
    name: "login"
  }, {
    path: "/register",
    component: _40d276ac,
    name: "register"
  }, {
    path: "/teacher",
    component: _c2d2de24,
    name: "teacher"
  }, {
    path: "/course/:id",
    component: _225e12e6,
    name: "course-id"
  }, {
    path: "/player/:vid?",
    component: _67c25d09,
    name: "player-vid"
  }, {
    path: "/teacher/:id",
    component: _3a601254,
    name: "teacher-id"
  }, {
    path: "/",
    component: _4a9e184a,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
