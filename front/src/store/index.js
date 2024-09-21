import { createStore } from 'vuex'
import auth from '@/store/auth'
import user from '@/store/user'
import stuff from '@/store/stuff'
import equipment from '@/store/equipment'
import shooting_equipment from '@/store/shooting_equipment'
import equipment_type from '@/store/equipment_type'
import warehouse from '@/store/warehouse'
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
    shooting_equipment: shooting_equipment,
    equipment_type: equipment_type,
    warehouse: warehouse
  }
})
