<template>
  <v-container v-if="editedProject">
    <v-card>
      <v-card-title>
        <span class="text-h5"
          >Изменить съёмку "{{ editedProject.project_name }}"</span
        >
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedProject.project_name"
                label="Название"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-select
                v-model="editedProject.project_type_name"
                :items="projectTypeNames"
                label="Площадка"
              />
            </v-col>
            
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedProject.shooting_start_date"
                label="Дата начала съемок"
                prepend-icon="mdi-calendar"
                @click="dialogStart = true"
                readonly
                clearable
              />
              <v-dialog v-model="dialogStart" width="400px">
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

            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedProject.shooting_end_date"
                label="Дата конца съемок"
                prepend-icon="mdi-calendar"
                @click="dialogEnd = true"
                readonly
                clearable
              />
              <v-dialog v-model="dialogEnd" width="400px">
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
            <v-col cols="12" md="6" sm="6">
              <v-select
                v-model="editedProject.chief_engineer_name"
                :items="userNames"
                label="Главный инженер"
              />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-switch
                v-model="editedProject.archived"
                clearable
                label="Архивировать"
                color="red-darken-1"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="save">
          Сохранить
        </v-btn>
        <v-btn color="red-darken-1" variant="text" @click="cancel">
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default {
  data() {
    return {
      dialogStart: false,
      dialogEnd: false,
      datePickerStartDate: new Date(),
      datePickerEndDate: new Date(),
    };
  },
  computed: {
    ...mapState("projects", ["editedProject"]),
    ...mapState("project_types", ["projectTypes", "projectTypeNames"]),
    ...mapState("user", ["user", "userNames"]),
  },
  methods: {
    ...mapActions("projects", ["getProjectByID", "updateProject"]),
    ...mapActions("project_types", [
      "getProjectTypeNames",
      "getAllProjectTypes",
    ]),
    ...mapActions("user", ["getAllUserNames"]),

    async save() {
      
      await this.updateProject(this.editedProject);
      window.location.href = "/projects";
    },
    cancel() {
      this.$router.go(-1);
    },
    updateStartDate() {
      const date = new Date(this.datePickerStartDate);

      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this.editedProject.shooting_start_date = date.toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
      this.editedProject.shooting_end_date = date.toISOString().split("T")[0];
      this.dialogStart = false;
    },

    updateEndDate() {
      const date = new Date(this.datePickerEndDate);

      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this.editedProject.shooting_end_date = date.toISOString().split("T")[0]; // Converts to 'YYYY-MM-DD'
      this.dialogEnd = false;
    },
  },
  created() {
    const route = useRoute();
    const projectId = route.params.id;

    this.getProjectByID(projectId);

    this.getProjectTypeNames();
    this.getAllUserNames();
  },
};
</script>
