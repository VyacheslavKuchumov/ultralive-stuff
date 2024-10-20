<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Новый проект</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="newProject.project_name"
                label="Название проекта"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                v-model="newProject.project_type_name"
                :items="projectTypeNames"
                label="Тип проекта"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                v-model="newProject.chief_engineer_name"
                :items="userNames"
                label="Главный инженер"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="newProject.shooting_date"
                label="Дата съемки"
                prepend-icon="mdi-calendar"
                @click="dialog = true"
                readonly
                clearable
              />
              <v-dialog v-model="dialog" width="400px">
                <v-card>
                  <v-date-picker v-model="datePickerDate" />
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialog = false"
                      >Закрыть</v-btn
                    >
                    <v-btn text color="primary" @click="updateDate">OK</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" @click="cancel">Отменить</v-btn>
        <v-btn color="blue-darken-1" @click="save">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      datePickerDate: new Date(),
      newProject: {
        project_name: "",
        project_type_name: "",
        chief_engineer_name: "",
        shooting_date: "",
      },
    };
  },
  computed: {
    ...mapState("project_types", ["projectTypes", "projectTypeNames"]),

    ...mapState("user", ["user", "userNames"]),
  },
  methods: {
    ...mapActions("projects", ["createProject"]),
    ...mapActions("project_types", [
      "getProjectTypeNames",
      "getAllProjectTypes",
      "createProjectType",
      "updateProjectType",
      "deleteProjectType",
    ]),

    ...mapActions("user", ["getAllUsers", "getAllUserNames"]),

    // Update the date using date picker
    updateDate() {
      const date = new Date(this.datePickerDate);
      this.newProject.shooting_date = date.toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
      this.dialog = false;
    },

    // Save method
    save() {
      this.createProject(this.newProject);
      this.$router.push("/projects");
    },

    cancel() {
      this.$router.push("/projects");
    },
  },
  async created() {
    try {
      // Fetch all necessary data
      this.getProjectTypeNames();
      this.getAllUserNames();
    } catch (error) {
      console.error("Error fetching data in beforeMount:", error);
    }
  },
};
</script>
