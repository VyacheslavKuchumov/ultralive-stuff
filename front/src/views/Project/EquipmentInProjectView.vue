<template>
  <v-card
    width="1100"
    class="elevation-5 mt-5 ml-auto mr-auto"
    v-if="project"
  >

    <!-- Table for equipment in the project -->
    <v-data-table
      v-if="equipment"
      :group-by="groupByInProject"
      :headers="headers"
      :items="project.equipment"
      :items-per-page="-1"
      fixed-header
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title
            v-if="project.shooting_start_date !== project.shooting_end_date"
          >
            Оборудование в съёмке: "{{ project.project_name }}" 
            ({{ formatDate(project.shooting_start_date) }} - 
            {{ formatDate(project.shooting_end_date) }})
          </v-toolbar-title>
          <v-toolbar-title v-else>
            Оборудование в съёмке: "{{ project.project_name }}" 
            ({{ formatDate(project.shooting_start_date) }})
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = true">
            Добавить оборудование
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:group-header="{
        item,
        columns,
        toggleGroup,
        isGroupOpen,
      }">
        <tr>
          <td :colspan="columns.length" @click="toggleGroup(item)">
            <v-btn
              :class="groupClassify(item)"
              :icon="isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
              size="small"
              variant="text"
            ></v-btn>
            <span :class="groupClassify(item)">{{ item.value }}</span>
            <v-btn
              class="ml-5"
              size="small"
              color="red-darken-1"
              @click.stop="removeGroup(item)"
              v-if="project.equipment.some(
                (equip) => equip.equipment_set.equipment_set_name === item.value
              )"
            >
              <v-icon>mdi-delete</v-icon>
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

    <!-- Dialog for available equipment -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Добавить оборудование</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-data-table
          v-if="equipment"
          :group-by="groupByAvailable"
          :headers="headers"
          :items="filteredEquipment"
          :items-per-page="-1"
          fixed-header
          hide-default-footer
        >
          <template v-slot:group-header="{
            item,
            columns,
            toggleGroup,
            isGroupOpen,
          }">
            <tr>
              <td :colspan="columns.length" @click="toggleGroup(item)">
                <v-btn
                  :class="groupClassify(item)"
                  :icon="isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                  size="small"
                  variant="text"
                ></v-btn>
                <span :class="groupClassify(item)">{{ item.value }}</span>
                <v-btn
                  class="ml-5"
                  size="small"
                  color="blue-darken-1"
                  @click.stop="addGroup(item)"
                  v-if="!project.equipment.some(
                    (equip) =>
                      equip.equipment_set.equipment_set_name === item.value
                  ) && groupClassify(item) === 'second-group'"
                >
                  <v-icon>mdi-plus</v-icon>
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
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { useRoute } from "vue-router";

export default {
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    ...mapState("equipment", ["equipment"]),
    ...mapState("equipment_in_project", ["project"]),
    headers() {
      return [
        { title: "Название", key: "equipment_name" },
        { title: "", key: "action_add", sortable: false },
        { title: "", key: "action_delete", sortable: false },
      ];
    },
    groupByAvailable() {
      return [
        { key: "equipment_set.type.set_type_name", order: "asc" },
        { key: "equipment_set.equipment_set_name", order: "asc" },
      ];
    },
    groupByInProject() {
      return [
        { key: "equipment_set.type.set_type_name", order: "asc" },
        { key: "equipment_set.equipment_set_name", order: "asc" },
      ];
    },
    filteredEquipment() {
      return this.equipment.filter(
        (equip) =>
          !this.project.equipment.some(
            (projectEquip) => projectEquip.equipment_id === equip.equipment_id
          )
      );
    },
  },
  methods: {
    ...mapActions("equipment_in_project", [
      "getProjectByID",
      "addEquipmentToProject",
      "removeEquipmentFromProject",
    ]),
    ...mapActions("equipment", [
      "getAllEquipment"
    ]),

    deleteItem(item) {
      const data = {
        project_id: this.project.project_id,
        equipment_id: item.equipment_id,
      };
      this.removeEquipmentFromProject(data);
    },
    addItem(item) {
      const data = {
        project_id: this.project.project_id,
        equipment_id: item.equipment_id,
      };
      this.addEquipmentToProject(data);
    },
    addGroup(group) {
      const equipmentToAdd = this.filteredEquipment.filter(
        (equip) => equip.equipment_set.equipment_set_name === group.value
      );
      equipmentToAdd.forEach((equip) => {
        const data = {
          project_id: this.project.project_id,
          equipment_id: equip.equipment_id,
        };
        this.addEquipmentToProject(data);
      });
    },
    removeGroup(group) {
      const equipmentToRemove = this.project.equipment.filter(
        (equip) => equip.equipment_set.equipment_set_name === group.value
      );
      equipmentToRemove.forEach((equip) => {
        const data = {
          project_id: this.project.project_id,
          equipment_id: equip.equipment_id,
        };
        this.removeEquipmentFromProject(data);
      });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("ru", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    groupClassify(item) {
      return item.key === "equipment_set.type.set_type_name"
        ? "first-group"
        : "second-group";
    },
  },
  created() {
    const route = useRoute();
    const projectId = route.params.id;

    this.getProjectByID(projectId);
    this.getAllEquipment()
  },
};
</script>

<style scoped>
.second-group {
  margin-left: 20px;
}
.first-group {
  font-weight: bolder;
}
</style>
