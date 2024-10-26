<template>
  <v-card class="elevation-5 mt-5 ml-auto mr-auto" v-if="editedProject">
    <v-table>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            Оборудование в съёмке: "{{ editedProject.project_name }}" ({{
              new Date(editedProject.shooting_date).toLocaleDateString("ru", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }})
          </v-toolbar-title>
        </v-toolbar>
      </template>

      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-container width="500">
            <v-data-table
              v-if="equipment"
              :group-by="groupByInProject"
              :headers="headers"
              :items="editedProject.equipment"
              :items-per-page="-1"
              height="400"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>В съёмке</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
              </template>

              <template
                v-slot:group-header="{
                  item,
                  columns,
                  toggleGroup,
                  isGroupOpen,
                }"
              >
                <tr>
                  <td :colspan="columns.length" @click="toggleGroup(item)">
                    <v-btn
                      :icon="isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                      size="small"
                      variant="text"
                    ></v-btn>
                    {{ item.value }}

                    <!-- Button to remove the entire group -->
                    <v-btn
                      size="small"
                      color="red-darken-1"
                      @click.stop="removeGroup(item)"
                      v-if="editedProject.equipment.some(equip => equip.equipment_set.equipment_set_name === item.value)"
                    >
                      Удалить группу
                    </v-btn>
                  </td>
                </tr>
              </template>

              <template v-slot:item.action_delete="{ item }">
                <v-btn
                  class="mr-5"
                  size="small"
                  color="red-darken-1"
                  @click="deleteItem(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>

              <template v-slot:no-data>Нет данных</template>
            </v-data-table>
          </v-container>
        </v-col>

        <v-col cols="auto">
          <v-container width="500">
            <v-data-table
              v-if="equipment"
              :group-by="groupByAvailable"
              :headers="headers"
              :items="filteredEquipment"
              :items-per-page="-1"
              height="400"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Доступное оборудование</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
              </template>

              <template
                v-slot:group-header="{
                  item,
                  columns,
                  toggleGroup,
                  isGroupOpen,
                }"
              >
                <tr>
                  <td :colspan="columns.length" @click="toggleGroup(item)">
                    <v-btn
                      :icon="isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                      size="small"
                      variant="text"
                    ></v-btn>
                    {{ item.value }}

                    <!-- Button to add the entire group -->
                    <v-btn
                      size="small"
                      color="blue-darken-1"
                      @click.stop="addGroup(item)"
                      v-if="!editedProject.equipment.some(equip => equip.equipment_set.equipment_set_name === item.value)"
                    >
                      Добавить группу
                    </v-btn>
                  </td>
                </tr>
              </template>

              <template v-slot:item.action_add="{ item }">
                <v-btn
                  class="mr-5"
                  size="small"
                  color="blue-darken-1"
                  @click="addItem(item)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>

              <template v-slot:no-data>Нет данных</template>
            </v-data-table>
          </v-container>
        </v-col>
      </v-row>
    </v-table>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { useRoute } from "vue-router";

export default {
  data() {
    return {
      search: "",
    };
  },
  computed: {
    ...mapState("projects", ["editedProject"]),
    ...mapState("equipment", ["equipment"]),
    headers() {
      return [
        { title: "Название", key: "equipment_name" },
        { title: "", key: "action_add", sortable: false },
        { title: "", key: "action_delete", sortable: false },
      ];
    },
    groupByAvailable() {
      return [
        {
          key: "equipment_set.equipment_set_name",
          order: "asc",
        },
      ];
    },
    groupByInProject() {
      return [
        {
          key: "equipment_set.equipment_set_name",
          order: "asc",
        },
      ];
    },
    filteredEquipment() {
      // Filter equipment that is not already in the edited project
      return this.equipment.filter(
        (equip) =>
          !this.editedProject.equipment.some(
            (projectEquip) =>
              projectEquip.equipment_id === equip.equipment_id
          )
      );
    },
  },
  methods: {
    ...mapActions("projects", [
      "getProjectByID",
      "updateProject",
      "addEquipmentToProject",
      "removeEquipmentFromProject",
    ]),
    ...mapActions("equipment", ["getAllEquipment"]),
    deleteItem(item) {
      const data = {
        project_id: this.editedProject.project_id,
        equipment_id: item.equipment_id,
      };
      this.removeEquipmentFromProject(data);
    },
    addItem(item) {
      const data = {
        project_id: this.editedProject.project_id,
        equipment_id: item.equipment_id,
      };
      this.addEquipmentToProject(data);
    },
    addGroup(group) {
      // Add all equipment items from the selected group to the project
      const equipmentToAdd = this.filteredEquipment.filter(
        (equip) =>
          equip.equipment_set.equipment_set_name === group.value
      );
      equipmentToAdd.forEach((equip) => {
        const data = {
          project_id: this.editedProject.project_id,
          equipment_id: equip.equipment_id,
        };
        this.addEquipmentToProject(data);
      });
    },
    removeGroup(group) {
      // Remove all equipment items from the selected group from the project
      const equipmentToRemove = this.editedProject.equipment.filter(
        (equip) =>
          equip.equipment_set.equipment_set_name === group.value
      );
      equipmentToRemove.forEach((equip) => {
        const data = {
          project_id: this.editedProject.project_id,
          equipment_id: equip.equipment_id,
        };
        this.removeEquipmentFromProject(data);
      });
    },
  },
  created() {
    const route = useRoute();
    const projectId = route.params.id;

    this.getProjectByID(projectId);
    this.getAllEquipment();
  },
};
</script>
