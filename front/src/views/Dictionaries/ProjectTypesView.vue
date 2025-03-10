<template>
  <v-container max-width="600">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="ProjectTypes"
          item-value="project_type_id"
          class="elevation-1"
          style="table-layout: auto; width: auto"
          :items-per-page="-1"
          fixed-header
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Площадки</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn class="mb-2" color="primary" dark @click="openDialog()">
                Добавить
              </v-btn>
            </v-toolbar>
          </template>

          <!-- Кнопка редактирования -->
          <template v-slot:item.action_edit="{ item }">
            <v-btn size="small" color="blue-darken-1" @click="openDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <!-- Кнопка удаления с подтверждением -->
          <template v-slot:item.action_delete="{ item }">
            <v-btn
              size="small"
              color="red-darken-1"
              @click="openConfirmDialog(item.project_type_id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Диалог добавления/редактирования -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ form.project_type_id ? "Изменить" : "Добавить" }} площадку
          </span>
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

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Подтвердите удаление</v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить эту площадку?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDialog = false">Отмена</v-btn>
          <v-btn color="red" text @click="confirmDelete()">Удалить</v-btn>
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
      dialog: false, // Диалог добавления/редактирования
      confirmDialog: false, // Диалог подтверждения удаления
      selectedId: null, // ID выбранной площадки для удаления
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

    // Открыть диалог добавления/редактирования
    openDialog(item = null) {
      this.form = item
        ? { ...item }
        : { project_type_id: null, project_type_name: "" };
      this.dialog = true;
    },

    // Закрыть диалог добавления/редактирования
    closeDialog() {
      this.dialog = false;
    },

    // Сохранить изменения (добавить или обновить запись)
    async saveItem() {
      if (this.form.project_type_id) {
        await this.updateProjectType(this.form);
      } else {
        await this.createProjectType(this.form);
      }
      this.getAllProjectTypes();
      this.closeDialog();
    },

    // Открыть диалог подтверждения удаления
    openConfirmDialog(id) {
      this.selectedId = id; // Сохраняем ID для удаления
      this.confirmDialog = true; // Открываем диалог подтверждения
    },

    // Подтвердить и выполнить удаление
    async confirmDelete() {
      if (this.selectedId) {
        await this.deleteProjectType({ project_type_id: this.selectedId });
        this.getAllProjectTypes();
      }
      this.confirmDialog = false; // Закрываем диалог
      this.selectedId = null; // Сбрасываем выбранный ID
    },
  },
  beforeMount() {
    this.getAllProjectTypes();
  },
};
</script>
