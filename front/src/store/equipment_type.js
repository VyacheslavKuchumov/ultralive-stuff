import instance from "@/middlewares";

export default {
  name: 'equipment_type',
  state: () => ({
    equipment_types: null
  }),
  mutations: {
    setEquipmentTypes(state, equipment_types) {
      state.equipment_types = equipment_types;
    }
  },
  actions: {
    async getAllEquipmentTypes({ commit }) {
      try {
        const equipmentTypes = await instance.get(`/api/equipment_type`);
        if (equipmentTypes) return commit('setEquipmentTypes', equipmentTypes.data);
      } catch (error) {
        console.error('Error fetching equipment types:', error);
      }
    },
    
    async getEquipmentTypeByID({ commit }, equipment_type_id) {
      try {
        const equipmentType = await instance.get(`/api/equipment_type/${equipment_type_id}`);
        if (equipmentType) return commit('setEquipmentTypes', equipmentType.data);
      } catch (error) {
        console.error('Error fetching equipment type by ID:', error);
      }
    },
    
    async createEquipmentType({ commit }, equipmentType) {
      try {
        const response = await instance.post('/api/equipment_type', equipmentType);
        if (response) return commit('setEquipmentTypes', response.data);
      } catch (error) {
        console.error('Error creating equipment type:', error);
      }
    },
    
    async updateEquipmentType({ commit }, equipmentType) {
      try {
        const response = await instance.put(`/api/equipment_type/${equipmentType.equipment_type_id}`, equipmentType);
        if (response) return commit('setEquipmentTypes', response.data);
      } catch (error) {
        console.error('Error updating equipment type:', error);
      }
    },
    
    async deleteEquipmentType({ commit }, equipmentType) {
      try {
        const response = await instance.delete(`/api/equipment_type/${equipmentType.equipment_type_id}`);
        if (response) return commit('setEquipmentTypes', response.data);
      } catch (error) {
        console.error('Error deleting equipment type:', error);
      }
    }
  },
  
  namespaced: true
};
