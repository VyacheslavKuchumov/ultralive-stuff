<template>
  <v-container width="600">
    <v-row>
      <v-col cols="12">
        
        <v-data-table
          :headers="headers"
          :items="equipmentTypes"
          item-value="id"
          class="elevation-1"
          style="table-layout: auto; width: auto;"
        >

          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Виды оборудования</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              
              
              <v-btn class="mb-2" color="primary" dark @click="openDialog()">
                Добавить
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="openDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            
            <v-btn icon @click="deleteItem(item.equipment_type_id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ form.equipment_type_id ? 'Edit' : 'Add' }} Equipment Type</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="form.equipment_type_name" label="Equipment Type Name" required></v-text-field>
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
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      dialog: false,
      form: { equipment_type_id: null, equipment_type_name: '' },
      headers: [
        
        { title: 'Name', value: 'equipment_type_name', width: 'auto' },
        { title: 'Actions', value: 'actions', sortable: false, width: 'auto' }
      ]
    };
  },
  computed: {
    ...mapState('equipment_type', ['equipment_types']),
    equipmentTypes() {
      return this.equipment_types || [];
    }
  },
  methods: {
    ...mapActions('equipment_type', [
      'getAllEquipmentTypes',
      'createEquipmentType',
      'updateEquipmentType',
      'deleteEquipmentType'
    ]),
    
    openDialog(item = null) {
      this.form = item ? { ...item } : { equipment_type_id: null, equipment_type_name: '' };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveItem() {
      if (this.form.equipment_type_id) {
        await this.updateEquipmentType(this.form);
      } else {
        await this.createEquipmentType(this.form);
      }
      this.getAllEquipmentTypes();
      this.closeDialog();
    },
    async deleteItem(id) {
      await this.deleteEquipmentType({ equipment_type_id: id });
      this.getAllEquipmentTypes();
    }
  },
  beforeMount() {
    this.getAllEquipmentTypes();
  }
};
</script>

<style scoped>
/* Add any required styles here */
</style>
