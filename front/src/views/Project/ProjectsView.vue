<template>

    <v-card max-width="800" class="elevation-0 mt-5 ml-auto mr-auto">
      <v-card-title
        align="center">
        Съёмки
      </v-card-title>
    
    </v-card>

    <v-card class="elevation-5 mt-5 ml-auto mr-auto" max-width="800">
    <v-toolbar flat>
      <v-btn icon="mdi-keyboard-backspace" color="primary" to="/"></v-btn>
      
      <v-spacer></v-spacer>

      
      
      <v-btn v-if="filterByEngineer" color="red" icon="mdi-account-search" @click="filterByEngineer = !filterByEngineer"></v-btn>
      <v-btn v-else color="grey" icon="mdi-account-search" @click="filterByEngineer = !filterByEngineer"></v-btn>
      <v-btn v-if="search" icon="mdi-filter" color="red" @click="searchDialog = !searchDialog"></v-btn>
      <v-btn v-else icon="mdi-filter" color="grey" @click="searchDialog = !searchDialog"></v-btn>
      <v-btn icon="mdi-plus" color="primary" to="/project/create"></v-btn>
      
    </v-toolbar>

    <v-container v-if="filteredProjects">
      <v-row v-for="item in filteredProjects"
      :key="item.project_id">
        <v-col

        >
          <v-card class="ma-2">
            
            <v-card-title class="text-h6">
              <v-icon v-if="checkProjects(item.project_id)" color="red-darken-1">mdi-swap-horizontal-bold</v-icon>
              {{ item.project_name }}
            </v-card-title>

            <v-card-subtitle class="text-body-2">
              {{ formatShootingDates(item) }}
            </v-card-subtitle>

            <v-card-text>
              <div class="text-caption">Площадка</div>
              <div class="text-body-1">{{ item.type.project_type_name }}</div>
              
              <div class="text-caption mt-2">Главный инженер</div>
              <div class="text-body-1">{{ item.chiefEngineer.name }}</div>
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn
                color="secondary"
                
                icon="mdi-camera"
                @click="goToProjectEquipment(item)"
              ></v-btn>
              
                <v-btn
                  icon="mdi-pencil"
                  color="blue-darken-1"
                  variant="text"
                  @click="goToEditPage(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  color="red-darken-1"
                  variant="text"
                  @click="confirmDelete(item)"
                ></v-btn>
             
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-alert v-else type="info" class="ma-4">
      Нет данных
    </v-alert>
  </v-card>

  <!-- Диалог подтверждения удаления -->
  <v-dialog v-model="confirmDeleteDialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h5">Подтвердите удаление</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить проект "{{ projectToDelete?.project_name }}"?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeConfirmDialog()">Отмена</v-btn>
        <v-btn color="red" @click="deleteConfirmed()">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="searchDialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h5">Поиск</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Поиск"
          prepend-icon="mdi-magnify"
          clearable
          placeholder="Поиск..."
        ></v-text-field>
        
      </v-card-text>
      <v-card-actions>
        
        <v-spacer></v-spacer>
        <v-btn text @click="searchDialog = false">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      search: "",
      confirmDeleteDialog: false,
      projectToDelete: null, // Хранит информацию о проекте для удаления
      searchDialog: false,
      filterByEngineer: true,
    };
  },
  computed: {
    

    filteredProjects() {
      const searchTerm = this.search?.toLowerCase() || '';
      
      if (this.projects() && this.user()) {
        // Determine the initial project set based on the filterByEngineer flag
        let filtered = this.filterByEngineer
          ? this.projects().filter(project => 
              project.chiefEngineer.name === this.user().name
            )
          : this.projects();

        // Apply search term filter if present
        if (searchTerm) {
          filtered = filtered.filter(project => {
            const values = [
              project.project_name,
              project.type.project_type_name,
              project.chiefEngineer.name,
              project.shooting_start_date,
              project.shooting_end_date
            ].join(' ').toLowerCase();
            return values.includes(searchTerm);
          });
        }

        return filtered;
      } else {
        return this.projects();
      }
    }
    
    
  },

  methods: {
    ...mapActions({
        getUser: "user/getUserByUid",

      }),
    projects() {
      return this.$store.state.projects.data;
    },
    user() {
      return this.$store.state.user.user;
    },
    conflicting_projects() {
      return this.$store.state.equipment_in_project.conflictingProjects;
    },

    ...mapActions({
      getAllProjects: "projects/getAllProjects",
      deleteProject: "projects/deleteProject",
      getConflictingProjects: "equipment_in_project/getConflictingProjects",
    }),

    isoToRussianDate(isoDate) {
            // Check if the input is a valid ISO date
            if (!isoDate || typeof isoDate !== "string") {
                throw new Error("Invalid input. Please provide a valid ISO date string.");
            }

            // Split the ISO date string into parts
            const [year, month, day] = isoDate.split("-");
            
            // Validate the extracted values
            if (!year || !month || !day || isNaN(Date.parse(isoDate))) {
                throw new Error("Invalid ISO date format.");
            }

            // Return the date in Russian format
            return `${day}.${month}.${year}`;
        },
    
    formatShootingDates(item) {
      if (item.shooting_start_date !== item.shooting_end_date) {
        return `с ${this.isoToRussianDate(item.shooting_start_date)} по ${this.isoToRussianDate(item.shooting_end_date)}`;
      }
      return this.isoToRussianDate(item.shooting_start_date);
    },

    checkProjects(item){
      const conflictingProjectIds = this.conflicting_projects().map((proj) => proj.project_id);
      return conflictingProjectIds.includes(item);
      
    },

    goToEditPage(item) {
      this.$router.push(`/project/edit/${item.project_id}`);
    },
    goToProjectEquipment(item) {
      this.$router.push(`/project/${item.project_id}`);
    },

    // Открыть диалог подтверждения
    confirmDelete(item) {
      this.projectToDelete = item; // Сохраняем проект для удаления
      this.confirmDeleteDialog = true; // Открываем диалог
    },

    // Закрыть диалог
    closeConfirmDialog() {
      this.confirmDeleteDialog = false;
      this.projectToDelete = null;
    },

    // Подтверждение удаления
    async deleteConfirmed() {
      if (this.projectToDelete) {
        await this.deleteProject(this.projectToDelete.project_id); // Удаляем проект
        await this.getAllProjects(); // Обновляем список проектов
      }
      this.closeConfirmDialog();
    },
  },
  async created() {
    await this.getConflictingProjects();
    await this.getAllProjects();
    await this.getUser();
    
  },
};
</script>
