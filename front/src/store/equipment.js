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
        
    },
    
    namespaced: true
};