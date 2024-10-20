import instance from "@/middlewares";

export default {
  name: "projects",
  state: () => ({
    projects: null,
  }),
  mutations: {
    setProjects(state, projects) {
      state.projects = projects;
    },
  },
  actions: {
    async getAllProjects({ commit }) {
      try {
        const response = await instance.get(`/api/projects`);
        if (response) {
          commit("setProjects", response.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    async getProjectByID({ commit }, project_id) {
      try {
        const response = await instance.get(`/api/projects/${project_id}`);
        if (response) {
          commit("setProjects", [response.data]); // Setting as an array to maintain consistency
        }
      } catch (error) {
        console.error("Error fetching project by ID:", error);
      }
    },
    async createProject({ commit }, project) {
      try {
        const response = await instance.post("/api/projects", project);
        if (response) {
          console.log("Project created successfully:", response.status);
        }
      } catch (error) {
        console.error("Error creating project:", error);
      }
    },
    async updateProject({ commit }, project) {
      try {
        const response = await instance.put(
          `/api/projects/${project.project_id}`,
          project
        );
        if (response) {
          commit("setProjects", response.data);
        }
      } catch (error) {
        console.error("Error updating project:", error);
      }
    },
    async deleteProject({ commit }, project_id) {
      try {
        const response = await instance.delete(`/api/projects/${project_id}`);
        if (response) {
          commit("setProjects", response.data);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    },
  },
  namespaced: true,
};
