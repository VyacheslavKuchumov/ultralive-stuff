<template>
  <v-container width="600">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="ProjectTypes"
          item-value="project_type_id"
          class="elevation-1"
          style="table-layout: auto; width: auto"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Площадки</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn class="mb-2" color="primary" dark @click="openDialog()">
                Add
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.action_edit="{ item }">
            <v-btn size="small" color="blue-darken-1" @click="openDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.action_delete="{ item }">
            <v-btn
              size="small"
              color="red-darken-1"
              @click="deleteItem(item.project_type_id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >{{ form.project_type_id ? "Изменить" : "Добавить" }} площадку</span
          >
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.project_type_name"
            label="Project Type Name"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()">Cancel</v-btn>
          <v-btn color="primary" @click="saveItem()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      form: { project_type_id: null, project_type_name: "" },
      headers: [
        { title: "Название", value: "project_type_name", width: "auto" },
        {
          title: "Изменить",
          value: "action_edit",
          sortable: false,
          width: "20",
        },
        {
          title: "Удалить",
          value: "action_delete",
          sortable: false,
          width: "20",
        },
      ],
    };
  },
  computed: {
    ...mapState("project_types", ["projectTypes"]),
    ProjectTypes() {
      return this.projectTypes || [];
    },
  },
  methods: {
    ...mapActions("project_types", [
      "getAllProjectTypes",
      "createProjectType",
      "updateProjectType",
      "deleteProjectType",
    ]),
    openDialog(item = null) {
      this.form = item
        ? { ...item }
        : { project_type_id: null, project_type_name: "" };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveItem() {
      if (this.form.project_type_id) {
        await this.updateProjectType(this.form);
      } else {
        await this.createProjectType(this.form);
      }
      this.getAllProjectTypes();
      this.closeDialog();
    },
    async deleteItem(id) {
      await this.deleteProjectType({ project_type_id: id });
      this.getAllProjectTypes();
    },
  },
  beforeMount() {
    this.getAllProjectTypes();
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
