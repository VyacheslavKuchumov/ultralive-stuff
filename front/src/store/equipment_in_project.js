import instance from "@/middlewares";
import equipment from "./equipment";

export default {
  name: "equipment_in_project",
  state: () => ({
    project: null,
  }),
  mutations: {
    setProject(state, project) {
      state.project = project;
    },

  },
  actions: {

    async getProjectByID({ commit }, project_id) {
        try {
          const response = await instance.get(
            `/api/equipment_in_project/${project_id}`
          );
          if (response) {
            console.log(response.data);
            
            
            commit("setProject", response.data); // Setting as an array to maintain consistency
          }
        } catch (error) {
          console.error("Error fetching project by ID:", error);
        }
      },
    
    async addEquipmentToProject({ commit }, input) {
      try {
        const body = {
          project_id: input.project_id,
          equipment_id: input.equipment_id,
        };

        const data = await instance.post(`/api/equipment_in_project/add`, body);
        commit("setProject", data);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async removeEquipmentFromProject({ commit }, input) {
      try {
        const body = {
          project_id: input.project_id,
          equipment_id: input.equipment_id,
        };
        const data = await instance.put(`/api/equipment_in_project/del`, body);
        commit("setProject", data);
        
        
      } catch (error) {
        console.error("Error:", error);
      }
    },

    
  },
  namespaced: true,
};
