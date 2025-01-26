<template>
  <v-card max-width="800" class="elevation-0 mt-5 ml-auto mr-auto">
      <v-card-title
        align="center">
        Новая съёмка
      </v-card-title>
    
  </v-card>
  
  <v-card class="elevation-5 mt-5 ml-auto mr-auto" max-width="600">
    <v-toolbar flat>
      <v-btn icon="mdi-keyboard-backspace" color="primary" to="/projects"></v-btn>
      
      <v-spacer></v-spacer>

      
    </v-toolbar>
    <v-card-text >
      <v-form ref="projectForm" v-model="valid" @submit.prevent="save" max-width="400" class="ml-auto mr-auto">
        <v-container >
          <v-row>
            <v-col >
              <v-text-field
                v-model="newProject.project_name"
                label="Название"
                clearable
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-autocomplete
                v-model="newProject.project_type_name"
                :items="projectTypeNames"
                label="Площадка"
                clearable
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="newProject.shooting_start_date"
                label="Дата начала съемок"
                prepend-icon="mdi-calendar"
                @click="dialogStart = true"
                readonly
                clearable
                :rules="[rules.required]"
              />
              <v-dialog v-model="dialogStart" max-width="400px">
                <v-card>
                  <v-date-picker v-model="datePickerStartDate" />
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialogStart = false"
                      >Закрыть</v-btn
                    >
                    <v-btn text color="primary" @click="updateStartDate"
                      >OK</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="newProject.shooting_end_date"
                label="Дата конца съемок"
                prepend-icon="mdi-calendar"
                @click="dialogEnd = true"
                readonly
                clearable
                :rules="[rules.required]"
              />
              <v-dialog v-model="dialogEnd" max-width="400px">
                <v-card>
                  <v-date-picker v-model="datePickerEndDate" />
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialogEnd = false"
                      >Закрыть</v-btn
                    >
                    <v-btn text color="primary" @click="updateEndDate"
                      >OK</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            </v-row>
            <v-row>
            <v-col>
              <v-autocomplete
                v-model="newProject.chief_engineer_name"
                :items="userNames"
                label="Главный инженер"
                clearable
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" @click="cancel">Отменить</v-btn>
        <v-btn color="blue-darken-1" @click="save">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      valid: false,
      rules: {
        required: value => !!value || 'Обязательное поле',
      },
      dialogStart: false,
      dialogEnd: false,
      datePickerStartDate: new Date(),
      datePickerEndDate: new Date(),
      newProject: {
        project_name: "",
        archived: false,
        project_type_name: "",
        chief_engineer_name: "",
        shooting_start_date: "",
        shooting_end_date: "",
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
    updateStartDate() {
      const date = new Date(this.datePickerStartDate);

      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this.newProject.shooting_start_date = date.toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
      this.newProject.shooting_end_date = date.toISOString().split("T")[0];
      this.dialogStart = false;
    },

    updateEndDate() {
      const date = new Date(this.datePickerEndDate);

      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this.newProject.shooting_end_date = date.toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
      this.dialogEnd = false;
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
  created() {
    // Fetch all necessary data
    this.getProjectTypeNames();
    this.getAllUserNames();
  },
};
</script>
