<template>
  <v-container max-width="1200">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="equipmentSets"
          :group-by="groupBy"
          item-value="id"
          class="elevation-1"
          style="table-layout: auto; width: auto"
          :items-per-page="-1"
          fixed-header
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Комплекты оборудования</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn class="mb-2" color="primary" dark to="/set_types">
                Виды комплектов
              </v-btn>
              <v-btn class="mb-2" color="primary" dark @click="openDialog()">
                Добавить комплект
              </v-btn>
            </v-toolbar>
          </template>

          <template
            v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
          >
            <tr>
              <td :colspan="columns.length" @click="toggleGroup(item)">
                <v-btn
                  :icon="
                    isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'
                  "
                  size="small"
                  variant="text"
                ></v-btn>
                <span>{{ item.value }}</span>
              </td>
            </tr>
          </template>

          <template v-slot:item.actions_see_equipment="{ item }">
            <v-btn
              size="small"
              color="secondary"
              @click="goToSetEquipment(item)"
              prepend-icon="mdi-camera"
            >
              Оборудование
            </v-btn>
          </template>
          <template v-slot:item.actions_edit="{ item }">
            <v-btn size="small" color="blue-darken-1" @click="openDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <template v-slot:item.actions_delete="{ item }">
            <v-btn
              size="small"
              color="red-darken-1"
              @click="deleteItem(item.equipment_set_id)"
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
            >{{
              form.equipment_set_id ? "Изменить" : "Добавить"
            }}
            комплект</span
          >
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.equipment_set_name"
            label="Введите название комплекта"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.description"
            label="Введите описание комплекта"
            required
          ></v-text-field>
          <v-autocomplete
            v-model="form.set_type_name"
            label="Введите вид комплекта"
            :items="setTypeNames"
            clearable
            required
          />
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
      form: {
        equipment_set_id: null,
        equipment_set_name: "",
        set_type_name: "",
        description: "",
      },
      headers: [
        {
          title: "Название",
          value: "equipment_set_name",
          width: "auto",
          sortable: true,
        },
        {
          title: "Описание",
          value: "description",
          width: "auto",
          sortable: false,
        },
        {
          title: "Оборудование",
          key: "actions_see_equipment",
          width: "auto",
          sortable: false,
        },
        {
          title: "Изменить",
          value: "actions_edit",
          sortable: false,
          width: "20",
        },
        {
          title: "Удалить",
          value: "actions_delete",
          sortable: false,
          width: "20",
        },
      ],
    };
  },
  computed: {
    ...mapState("equipment_set", ["equipment_sets"]),
    ...mapState("set_types", ["setTypeNames"]),
    equipmentSets() {
      return this.equipment_sets || [];
    },
    groupBy() {
      return [
        {
          key: "type.set_type_name",
          order: "asc",
        },
      ];
    },
  },
  methods: {
    ...mapActions("equipment_set", [
      "getAllEquipmentSets", // Should be renamed to 'getAllEquipmentSets' in the Vuex store
      "createEquipmentSet", // Should be renamed to 'createEquipmentSet'
      "updateEquipmentSet", // Should be renamed to 'updateEquipmentSet'
      "deleteEquipmentSet", // Should be renamed to 'deleteEquipmentSet'
    ]),
    ...mapActions("set_types", ["getSetTypeNames"]),
    openDialog(item = null) {
      this.form = item
        ? {
            equipment_set_id: item.equipment_set_id,
            equipment_set_name: item.equipment_set_name,
            set_type_name: item.type.set_type_name,
            description: item.description,
          }
        : {
            equipment_set_id: null,
            equipment_set_name: "",
            set_type_name: "",
            description: "",
          };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    saveItem() {
      if (this.form.equipment_set_id) {
        this.updateEquipmentSet(this.form);
      } else {
        this.createEquipmentSet(this.form);
      }

      this.closeDialog();
    },
    deleteItem(id) {
      this.deleteEquipmentSet({ equipment_set_id: id });
    },
    goToSetEquipment(item) {
      this.$router.push(`/equipment/${item.equipment_set_id}`);
    },
  },
  beforeMount() {
    this.getAllEquipmentSets();
    this.getSetTypeNames();
  },
};
</script>
