<template>
  <v-container v-if="editedItem">
    <v-card>
      <v-card-title>
        <span class="text-h5"
          >Изменить проект "{{ editedItem.project_name }}"</span
        >
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedItem.project_name"
                label="Название проекта"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-select
                v-model="editedItem.type"
                :items="projectTypes"
                item-title="project_type_name"
                item-value="project_type_id"
                label="Тип проекта"
              />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                v-model="editedItem.chief_engineer_id"
                label="Главный инженер"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                prepend-icon="mdi-calendar"
                label="Дата съемки"
                v-model="editedItem.shooting_date"
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
        <v-btn color="grey-darken-1" variant="text" @click="cancel">
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
      projectTypes: [],
    };
  },
  computed: {
    ...mapState("projects", ["project"]),
    ...mapState("project_type", ["project_types"]),
    editedItem: {
      get() {
        return this.project;
      },
      set(value) {
        this.$store.commit("projects/setProject", value);
      },
    },
  },
  methods: {
    ...mapActions("projects", ["getProjectByID", "updateProject"]),
    ...mapActions("project_type", ["getAllProjectTypes"]),

    async save() {
      await this.updateProject(this.editedItem);
      this.$router.push("/projects");
    },
    cancel() {
      this.$router.push("/projects");
    },
    updateDate() {
      const date = new Date(this.datePickerDate);
      this.editedItem.shooting_date = date.toLocaleDateString("ru-RU"); // Russian formatting
      this.dialog = false;
    },
  },
  async created() {
    const route = useRoute();
    const projectId = route.params.id;
    await this.getProjectByID(projectId);

    await this.getAllProjectTypes();
    this.projectTypes = this.project_types.map((type) => ({
      ...type,
      text: type.project_type_name,
    }));
  },
};
</script>
