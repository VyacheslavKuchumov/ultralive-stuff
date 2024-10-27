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
              <v-select
                v-model="editedProject.chief_engineer_name"
                :items="userNames"
                label="Главный инженер"
              />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                prepend-icon="mdi-calendar"
                label="Дата съемки"
                v-model="editedProject.shooting_date"
                @click="dialog = true"
              />
              <v-dialog v-model="dialog" width="400px">
                <v-card>
                  <v-date-picker v-model="datePickerDate"></v-date-picker>
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
      dialog: false,
      datePickerDate: new Date(),
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
      this.$router.push("/projects");
    },
    updateDate() {
      const date = new Date(this.datePickerDate);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      this.editedProject.shooting_date = date.toISOString().split("T")[0];
      this.dialog = false;
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
