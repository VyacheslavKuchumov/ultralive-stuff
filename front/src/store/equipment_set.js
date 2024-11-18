import instance from "@/middlewares";

export default {
  name: "equipment_set",
  state: () => ({
    equipment_sets: null,
    equipmentSetNames: [],
  }),
  mutations: {
    setEquipmentSets(state, equipment_sets) {
      state.equipment_sets = equipment_sets;
    },
    setEquipmentSetNames(state, names) {
      state.equipmentSetNames = names;
    },
  },
  actions: {
    async getAllEquipmentSetNames({ commit }) {
      const equipmentSets = await instance.get(`/api/equipment_set`);
      if (equipmentSets) {
        const names = equipmentSets.data.map(
          ({ equipment_set_name }) => equipment_set_name
        );
        return commit("setEquipmentSetNames", names);
      }
    },
    async getAllEquipmentSets({ commit }) {
      try {
        const equipmentSets = await instance.get(`/api/equipment_set`);
        if (equipmentSets)
          return commit("setEquipmentSets", equipmentSets.data);
      } catch (error) {
        console.error("Error fetching equipment sets:", error);
      }
    },

    async getEquipmentSetByID({ commit }, equipment_set_id) {
      try {
        const equipmentSet = await instance.get(
          `/api/equipment_set/${equipment_set_id}`
        );
        if (equipmentSet) return commit("setEquipmentSets", equipmentSet.data);
      } catch (error) {
        console.error("Error fetching equipment set by ID:", error);
      }
    },

    async createEquipmentSet({ commit }, equipmentSet) {
      try {
        const response = await instance.post(
          "/api/equipment_set",
          equipmentSet
        );
        if (response) return commit("setEquipmentSets", response.data);
      } catch (error) {
        console.error("Error creating equipment set:", error);
      }
    },

    async updateEquipmentSet({ commit }, equipmentSet) {
      try {
        const response = await instance.put(
          `/api/equipment_set/${equipmentSet.equipment_set_id}`,
          equipmentSet
        );
        if (response) return commit("setEquipmentSets", response.data);
      } catch (error) {
        console.error("Error updating equipment set:", error);
      }
    },

    async deleteEquipmentSet({ commit }, equipmentSet) {
      try {
        const response = await instance.delete(
          `/api/equipment_set/${equipmentSet.equipment_set_id}`
        );
        if (response) return commit("setEquipmentSets", response.data);
      } catch (error) {
        console.error("Error deleting equipment set:", error);
      }
    },
  },

  namespaced: true,
};
