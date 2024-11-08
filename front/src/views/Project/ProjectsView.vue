<template>
  <v-card class="elevation-5 mt-5 ml-auto mr-auto" width="1100">
    <v-data-table
      v-if="projects"

      :headers="headers"
      :items="filteredProjects"
      :items-per-page="-1"
      :search="search"
      height="400"
      fixed-header
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Съёмки</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn class="mb-2" color="primary" dark to="/project_types">
            Площадки
          </v-btn>
          <v-btn class="mb-2" color="primary" dark to="/project/create">
            Новая съёмка
          </v-btn>
        </v-toolbar>
      </template>

      

      <template v-slot:item="{ item }">
        <tr>
          
          <!-- Status Column -->
          <td align="center">
            <v-icon v-if="projectsWithSharedEquipment.has(item.project_id)" color="blue">
              mdi-alert
            </v-icon>
            <v-icon v-else color="green">mdi-check-circle</v-icon>
          </td>
          <td>{{ item.shooting_date }}</td>
          <td>{{ item.project_name }}</td>
          <td>{{ item.type.project_type_name }}</td>
          <td>{{ item.chiefEngineer.name }}</td>
          <td>
            <v-btn
              size="small"
              color="secondary"
              @click="goToProjectEquipment(item)"
              prepend-icon="mdi-camera"
            >
              Оборудование
            </v-btn>
          </td>
          <td>
            <v-btn
              class="mr-5"
              size="small"
              color="blue-darken-1"
              @click="goToEditPage(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </td>
          <td>
            <v-btn size="small" color="red-darken-1" @click="deleteItem(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:no-data>
        <v-alert type="info" color="blue" icon="mdi-information">
          Нет данных
        </v-alert>
      </template>

      <template v-slot:bottom>
        <v-card>
          <v-card-title>Поиск по названию</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Поиск"
              prepend-icon="mdi-magnify"
              clearable
              placeholder="Search..."
              class="mt-2"
              width="400"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      search: "",
    };
  },
  computed: {
    ...mapState("projects", ["projects"]),
    headers() {
      return [
        { title: "Статус", key: "status", },
        { title: "Дата съёмки", key: "shooting_date",},
        { title: "Название", key: "project_name", },
        { title: "Площадка", key: "type.project_type_name",  },
        { title: "Главный инженер", key: "chiefEngineer.name",  },
        { title: "Оборудование", key: "action_see_equipment", sortable: false, },
        { title: "Изменить", key: "action_edit", sortable: false, },
        { title: "Удалить", key: "action_delete", sortable: false, },
      ];
    },
    // groupBy() {
    //   return [
    //     {
    //       key: "shooting_date",
    //       order: "desc",
    //     },
    //   ];
    // },
    filteredProjects() {
      if (!this.search) {
        return this.projects;
      }
      const searchTerm = this.search.toLowerCase();
      return this.projects.filter((item) =>
        item.project_name.toLowerCase().includes(searchTerm)
      );
    },
    projectsWithSharedEquipment() {
      // Create a map to store equipment and shooting_date combinations.
      const equipmentDateMap = {};

      // Iterate through each project and its equipment.
      this.projects.forEach((project) => {
        project.equipment.forEach((eq) => {
          const key = `${eq.equipment_id}_${project.shooting_date}`;

          // Initialize an empty array for this key if not already present.
          if (!equipmentDateMap[key]) {
            equipmentDateMap[key] = [];
          }

          // Store the project ID for the combination of equipment and shooting_date.
          equipmentDateMap[key].push(project.project_id);
        });
      });

      // Find project IDs that have shared equipment on the same date.
      const sharedProjectIds = new Set();
      Object.values(equipmentDateMap).forEach((projectIds) => {
        // If more than one project shares the same equipment and date, mark them.
        if (projectIds.length > 1) {
          projectIds.forEach((id) => sharedProjectIds.add(id));
        }
      });

      return sharedProjectIds;
    },

  },
  methods: {
    ...mapActions("projects", ["getAllProjects", "deleteProject"]),
    initialize() {
      this.getAllProjects();
    },
    goToEditPage(item) {
      this.$router.push(`/project/edit/${item.project_id}`);
    },
    deleteItem(item) {
      this.deleteProject(item.project_id);
    },
    goToProjectEquipment(item) {
      this.$router.push(`/project/${item.project_id}`);
    },
   
  },
  created() {
    this.initialize();
  },
};
</script>


