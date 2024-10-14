import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import EquipmentView from '@/views/Equipment/EquipmentView.vue'
import CreateEquipmentView from '@/views/Equipment/CreateEquipmentView.vue'
import EditEquipmentView from '@/views/Equipment/EditEquipmentView.vue'
import AboutView from '@/views/AboutView.vue'
import Register from '@/views/Auth/Register.vue'
import Login from '@/views/Auth/Login.vue'
import instance from '@/middlewares'
import OneShootingView from '@/views/OneShootingView.vue'
import EquipmentTypesView from '@/views/Dictionaries/EquipmentTypesView.vue'

import auth from '@/store/auth'
import WarehousesView from '@/views/Dictionaries/WarehousesView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {auth:true}
  },
  
  {
    path: '/equipment',
    name: 'equipment',
    component: EquipmentView,
    meta: {auth:true},
  },
  
  {
    path: '/equipment/create',
    name: 'create-equipment',
    component: CreateEquipmentView,
    meta: { auth: true },
  },
  
  {
    path: '/equipment/edit/:id',
    name: 'edit-equipment',
    component: EditEquipmentView,
    meta: { auth: true },
    props: true, // Pass route params as props to component
  },

  {
    path: '/equipment_types',
    name: 'equipment_types',
    component: EquipmentTypesView,
    meta: { auth: true },
  },

  {
    path: '/warehouses',
    name: 'warehouses',
    component: WarehousesView,
    meta: { auth: true },
    props: true, // Pass route params as props to component
  },

  {
    path: '/shooting/:id',
    name: 'shooting',
    component: OneShootingView,
    meta: {auth:true}
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {auth:true}
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
 
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach(async(to, from, next) => {
  try{
    const requireAuth = to.matched.some(record => record?.meta.auth)
    if (requireAuth){
      const uid = localStorage.getItem('uid')
      const response = await instance.get(`/api/users/${uid}`)
      if (response.status ==200){
        
        return next ()

      } else if (response.status == 403){
        return next ('/login')
      }

    }
    return next()

  } catch(error)  {
    return next ('/login')

  }
})

export default router
