import instance from "@/middlewares";

export default {
  name: "equipment_set",
  state: () => ({
    equipment_sets: null,
    equipmentSetNames: [],
    one_set: null,
    maintenance_sets: null,
    storage_sets: null,
  }),
  mutations: {
    setEquipmentSets(state, equipment_sets) {
      state.equipment_sets = equipment_sets;
    },
    setEquipmentSetNames(state, names) {
      state.equipmentSetNames = names;
    },
    setEquipmentSet(state, equipment_set) {
      state.one_set = equipment_set;
    },
    setMaintenanceSets(state, maintenance_sets) {
      state.maintenance_sets = maintenance_sets;
    },
    setStorageSets(state, storage_sets) {
      state.storage_sets = storage_sets;
    },
  },
  actions: {
    async getAllEquipmentSetNames({ commit }) {
      try {
        const response = await instance.get(`/api/equipment_set`);
        if (response.status === 200) {
          const names = response.data.map(
            ({ equipment_set_name }) => equipment_set_name
          );
          return commit("setEquipmentSetNames", names);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching equipment set names:", error);
        window.alert("An error occurred while fetching equipment set names.");
      }
    },

    async getAllEquipmentSets({ commit }) {
      try {
        const response = await instance.get(`/api/equipment_set`);
        if (response.status === 200) {
          return commit("setEquipmentSets", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching equipment sets:", error);
        window.alert("An error occurred while fetching equipment sets.");
      }
    },

    async getEquipmentSetByID({ commit }, equipment_set_id) {
      try {
        const response = await instance.get(
          `/api/equipment_set/search/${equipment_set_id}`
        );
        if (response.status === 200) {
          return commit("setEquipmentSet", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching equipment set by ID:", error);
        window.alert("An error occurred while fetching the equipment set.");
      }
    },

    async createEquipmentSet({ commit }, equipmentSet) {
      try {
        const response = await instance.post("/api/equipment_set", equipmentSet);
        if (response.status === 201) {
          console.log("Equipment set created successfully:", response.data);
          return commit("setEquipmentSets", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error creating equipment set:", error);
        window.alert("An error occurred while creating the equipment set.");
      }
    },

    async updateEquipmentSet({ commit }, equipmentSet) {
      try {
        const response = await instance.put(
          `/api/equipment_set/${equipmentSet.equipment_set_id}`,
          equipmentSet
        );
        if (response.status === 200) {
          return commit("setEquipmentSets", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error updating equipment set:", error);
        window.alert("An error occurred while updating the equipment set.");
      }
    },

    async deleteEquipmentSet({ commit }, equipmentSet) {
      try {
        const response = await instance.delete(
          `/api/equipment_set/${equipmentSet.equipment_set_id}`
        );
        if (response.status === 200) {
          return commit("setEquipmentSets", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error deleting equipment set:", error);
        window.alert("An error occurred while deleting the equipment set.");
      }
    },
    async getMaintenanceSets({ commit }) {
      try {
        const response = await instance.get(`/api/equipment_set/maintenance`);
        if (response.status === 200) {
          return commit("setMaintenanceSets", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching maintenance sets:", error);
        window.alert("An error occurred while fetching maintenance sets.");
      }
    },
    async getStorageSets({ commit }) {
      try {
        const response = await instance.get(`/api/equipment_set/storage`);
        if (response.status === 200) {
          return commit("setStorageSets", response.data);
        }
        window.alert(`Error: ${response.status} - ${response.statusText}`);
      } catch (error) {
        console.error("Error fetching storage sets:", error);
        window.alert("An error occurred while fetching storage sets.");
      }
    }

  },

  namespaced: true,
};
