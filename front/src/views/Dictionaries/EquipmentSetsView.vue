<template>
  <v-container width="700">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="equipmentSets"
          item-value="id"
          class="elevation-1"
          style="table-layout: auto; width: auto"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Комплекты оборудования</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn class="mb-2" color="primary" dark @click="openDialog()">
                Add
              </v-btn>
            </v-toolbar>
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
            label="Equipment Set Name"
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
      form: { equipment_set_id: null, equipment_set_name: "" },
      headers: [
        { title: "Name", value: "equipment_set_name", width: "auto" },
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
    equipmentSets() {
      return this.equipment_sets || [];
    },
  },
  methods: {
    ...mapActions("equipment_set", [
      "getAllEquipmentSets", // Should be renamed to 'getAllEquipmentSets' in the Vuex store
      "createEquipmentSet", // Should be renamed to 'createEquipmentSet'
      "updateEquipmentSet", // Should be renamed to 'updateEquipmentSet'
      "deleteEquipmentSet", // Should be renamed to 'deleteEquipmentSet'
    ]),

    openDialog(item = null) {
      this.form = item
        ? { ...item }
        : { equipment_set_id: null, equipment_set_name: "" };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveItem() {
      if (this.form.equipment_set_id) {
        await this.updateEquipmentSet(this.form);
      } else {
        await this.createEquipmentSet(this.form);
      }
      this.getAllEquipmentSets();
      this.closeDialog();
    },
    async deleteItem(id) {
      await this.deleteEquipmentSet({ equipment_set_id: id });
      this.getAllEquipmentSets();
    },
  },
  beforeMount() {
    this.getAllEquipmentSets();
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
