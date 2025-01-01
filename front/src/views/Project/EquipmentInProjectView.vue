<template>

  <v-card
    max-width="1100"
    class="elevation-5 mt-5 ml-auto mr-auto"
    v-if="project"
  >
    <v-card-title
      
      v-if="project.shooting_start_date !== project.shooting_end_date"
    >
      "{{ project.project_name }}" 
      ({{ formatDate(project.shooting_start_date) }} - 
      {{ formatDate(project.shooting_end_date) }})
    </v-card-title>
    <v-card-title v-else>
      "{{ project.project_name }}" 
      ({{ formatDate(project.shooting_start_date) }})
    </v-card-title>
  
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
          <v-toolbar-title>
            Оборудование в съёмке
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
          <v-btn v-if="!sets_view" @click="sets_view = true" class="mb-2" color="red" dark>
            Назад
          </v-btn>
          
        </v-toolbar>
        <v-data-table
          v-if="equipment_sets && sets_view"
          :group-by="groupBySets"
          :headers="setsHeaders"
          :items="equipment_sets"
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
                  
                  :icon="isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                  size="small"
                  variant="text"
                ></v-btn>
                <span>{{ item.value }}</span>
                
              </td>
            </tr>
          </template>

          <template v-slot:item.actions_see_equipment="{ item }">
            <v-btn
              class="mr-5"
              size="small"
              color="secondary"
              @click="showEquipment(item)"
            >
              <v-icon>mdi-camera</v-icon>
            </v-btn>
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


        <v-data-table
          v-if="equipment && !sets_view"
          :headers="equipmentHeaders"
          :items="equipment"
          :items-per-page="-1"
          fixed-header
          hide-default-footer
        >
          

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
      sets_view: true
    };
  },
  computed: {
    ...mapState("equipment", ["equipment"]),
    ...mapState("equipment_in_project", ["project"]),
    ...mapState("equipment_set", ["equipment_sets"]),

    headers() {
      return [
        { title: "Название", key: "equipment_name" },
        { title: "", key: "action_add", sortable: false },
        { title: "", key: "action_delete", sortable: false },
      ];
    },

    setsHeaders() {
      return [
        { title: "Название комплекта", key: "equipment_set_name" },
        {
          title: "",
          key: "actions_see_equipment",
          sortable: false,
        },
        { title: "", key: "action_add", sortable: false },
        
      ];
    },
    groupBySets() {
      return [
        { key: "type.set_type_name", order: "asc" },
        
      ];
    },
    equipmentHeaders() {
      return [
        { title: "Название", key: "equipment_name" },
        { title: "", key: "action_add", sortable: false },
      ];
    },
    groupByEquipment() {
      return [
        { key: "set.set_type_name", order: "asc" },
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
      "getAllEquipment",
      "getEquipmentBySetID"
    ]),
    
    ...mapActions("equipment_set", [
      "getAllEquipmentSets",
      "createEquipmentSet",
      "updateEquipmentSet",
      "deleteEquipmentSet",
    ]),
    showEquipment(item){
      this.getEquipmentBySetID(item.equipment_set_id)
      this.sets_view = false
    },

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
    this.getAllEquipmentSets();
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
