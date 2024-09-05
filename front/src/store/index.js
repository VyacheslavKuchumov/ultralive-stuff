import { createStore } from 'vuex'
import auth from '@/store/auth'
import user from '@/store/user'
import stuff from '@/store/stuff'
import equipment from '@/store/equipment'
import shooting_equipment from '@/store/shooting_equipment'
export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth: auth,
    user: user,
    stuff: stuff,
    equipment: equipment,
    shooting_equipment:shooting_equipment, 
  }
})
