import instance from "@/middlewares"

export default {
    name: 'equipment',
    state: () => ({
        equipment: null
    }),
    mutations: {
        setEquipment(state, equipment) {
            state.equipment = equipment
        }
    },
    actions: {
        async getAllEquipment({ commit }) {
            
            const equipment = await instance.get(`/api/equipment`)
            if (equipment) return commit('setEquipment', equipment.data)
            console.log(equipment.message);
        },
        async createEquipment({ commit }, equipment) {
            try {
              const response = await instance.post('/api/equipment', equipment);
              if (response) return commit('setEquipment', response.data)
            } catch (error) {
              console.error('Error creating equipment:', error);
            }
          },
          async updateEquipment({ commit }, equipment) {
            try {
              const response = await instance.put(`/api/equipment/`, equipment);
              if (response) return commit('setEquipment', response.data)
            } catch (error) {
              console.error('Error updating equipment:', error);
            }
          },
          async deleteEquipment({ commit }, equipment) {
            try {
                console.log(equipment)
                const response = await instance.delete(`/api/equipment/`, { data: { id: equipment.id } });
                if (response) return commit('setEquipment', response.data)
            } catch (error) {
              console.error('Error deleting equipment:', error);
            }
          },
        
    },
    
    namespaced: true
};