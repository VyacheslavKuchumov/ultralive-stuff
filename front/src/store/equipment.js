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
    async getEquipmentByID({ commit }, equipment_id) {
      const equipment = await instance.get(
        `/api/equipment/search/${equipment_id}`
      );
      console.log(equipment);
      const formattedEquipment = {
        equipment_id: equipment.data.equipment_id,
        equipment_name: equipment.data.equipment_name,
        serial_number: equipment.data.serial_number,
        equipment_set_name: equipment.data.equipment_set.equipment_set_name,
        warehouse_name: equipment.data.storage.warehouse_name,
        current_storage_name: equipment.data.current_storage,
        needs_maintenance: equipment.data.needs_maintenance,
        date_of_purchase: equipment.data.date_of_purchase,
        cost_of_purchase: equipment.data.cost_of_purchase,
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
