import instance from "@/middlewares";

export default {
  name: "project_types",
  state: () => ({
    projectTypes: null,
    projectTypeNames: [],
  }),
  mutations: {
    setProjectTypes(state, projectTypes) {
      state.projectTypes = projectTypes;
    },
    setProjectTypeNames(state, names) {
      state.projectTypeNames = names;
    },
  },

  actions: {
    async getProjectTypeNames({ commit }) {
      try {
        const response = await instance.get(`/api/project_types`);

        if (response) {
          const names = response.data.map(
            ({ project_type_name }) => project_type_name
          );
          console.log(names);
          return commit("setProjectTypeNames", names);
        }
      } catch (error) {
        console.error("Error fetching project types:", error);
      }
    },
    async getAllProjectTypes({ commit }) {
      try {
        const response = await instance.get(`/api/project_types`);
        console.log(response.data);
        if (response) return commit("setProjectTypes", response.data);
      } catch (error) {
        console.error("Error fetching project types:", error);
      }
    },

    async getProjectTypeByID({ commit }, project_type_id) {
      try {
        const response = await instance.get(
          `/api/project_types/${project_type_id}`
        );
        if (response) return commit("setProjectTypes", [response.data]); // Wrap in array for consistency
      } catch (error) {
        console.error("Error fetching project type by ID:", error);
      }
    },

    async createProjectType({ commit }, projectType) {
      try {
        const response = await instance.post("/api/project_types", projectType);
        if (response) return commit("setProjectTypes", response.data);
      } catch (error) {
        console.error("Error creating project type:", error);
      }
    },

    async updateProjectType({ commit }, projectType) {
      try {
        const response = await instance.put(
          `/api/project_types/${projectType.project_type_id}`,
          projectType
        );
        if (response) return commit("setProjectTypes", response.data);
      } catch (error) {
        console.error("Error updating project type:", error);
      }
    },

    async deleteProjectType({ commit }, projectType) {
      try {
        const response = await instance.delete(
          `/api/project_types/${projectType.project_type_id}`
        );
        if (response) return commit("setProjectTypes", response.data);
      } catch (error) {
        console.error("Error deleting project type:", error);
      }
    },
  },

  namespaced: true,
};
