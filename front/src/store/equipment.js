import instance from "@/middlewares";

export default {
  name: "equipment",
  state: () => ({
    equipment: null,
    editedEquipment: null,
  }),
  mutations: {
    setEquipment(state, equipment) {
      state.equipment = equipment;
    },
    setEditedEquipment(state, equipment) {
      state.editedEquipment = equipment;
    },
  },
  actions: {
    async getAllEquipment({ commit }) {
      const equipment = await instance.get(`/api/equipment`);
      if (equipment) return commit("setEquipment", equipment.data);
      console.log(equipment.message);
    },
    async getEquipmentBySetID({ commit }, set_id) {
      const response = await instance.get(`/api/equipment/set/${set_id}`);

      if (response) return commit("setEquipment", response.data);
      console.log(response);
    },
    async getEquipmentByID({ commit }, equipment_id) {
      const equipment = await instance.get(
        `/api/equipment/search/${equipment_id}`
      );
      console.log(equipment);
      const formattedEquipment = {
        ...equipment.data,
        equipment_set_name: equipment.data.equipment_set.equipment_set_name,
        warehouse_name: equipment.data.storage.warehouse_name,
      };
      if (equipment) return commit("setEditedEquipment", formattedEquipment);
      console.log(equipment.message);
    },

    async createEquipment({ commit }, equipment) {
      try {
        console.log("creating the equipment...");
        console.log(equipment);
        console.log(equipment.date_of_purchase);

        const response = await instance.post("/api/equipment", equipment);
        if (response) {
          console.log(response.status);
          return;
        }
      } catch (error) {
        console.error("Error creating equipment:", error);
      }
    },
    async updateEquipment({ commit }, equipment) {
      try {
        const response = await instance.put(
          `/api/equipment/${equipment.equipment_id}`,
          equipment
        );
        console.log(response);
        if (response) return commit("setEquipment", response.data);
      } catch (error) {
        console.error("Error updating equipment:", error.message);
      }
    },
    async deleteEquipment({ commit }, equipment) {
      try {
        const response = await instance.delete(
          `/api/equipment/${equipment.equipment_id}`
        );
        if (response) return commit("setEquipment", response.data);
      } catch (error) {
        console.error("Error deleting equipment:", error);
      }
    },
  },

  namespaced: true,
};
