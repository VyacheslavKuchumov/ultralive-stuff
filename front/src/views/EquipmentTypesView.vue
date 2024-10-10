<template>
    <v-card class="elevation-5 mt-5">
      <v-data-table
        v-if="equipmentTypes"
        :headers="headers"
        :items="equipmentTypes"
        :items-per-page="-1"
        class="auto-width-table"
        
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Equipment Types</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn class="mb-2" color="primary" dark @click="goToEquipmentPage">
              Назад
            </v-btn>
            <v-btn class="mb-2" color="primary" dark @click="openCreateDialog">
              New Equipment Type
            </v-btn>
          </v-toolbar>
        </template>
  
        <!-- Row templates -->
        <template v-slot:item.action_edit="{ item }">
          <v-btn class="mr-5" size="small" color="blue-darken-1" @click="openEditDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
  
        <template v-slot:item.action_delete="{ item }">
          <v-btn size="small" color="red-darken-1" @click="deleteItem(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
  
        <template v-slot:no-data>No Data Available</template>
      </v-data-table>
  
      <!-- Create/Edit Dialog -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ dialogMode === 'edit' ? 'Edit' : 'Create' }} Equipment Type</span>
          </v-card-title>
  
          <v-card-text>
            <v-form ref="equipmentForm">
              <v-text-field
                v-model="form.equipment_type_name"
                label="Equipment Type Name"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveEquipmentType">
              {{ dialogMode === 'edit' ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
</template>
  
<script>
  import { mapActions, mapState } from 'vuex';
  
  export default {
    data() {
      return {
        dialog: false,
        dialogMode: 'create',
        form: {
          equipment_type_id: null,
          equipment_type_name: ''
        }
      };
    },
    computed: {
      ...mapState('equipment_type', ['equipment_types']),
      equipmentTypes() {
        return this.equipment_types;
      },
      headers() {
        return [
          { text: 'Equipment Type Name', value: 'equipment_type_name' },
          { text: 'Edit', value: 'action_edit', sortable: false },
          { text: 'Delete', value: 'action_delete', sortable: false }
        ];
      }
    },
    methods: {
      ...mapActions('equipment_type', [
        'getAllEquipmentTypes',
        'createEquipmentType',
        'updateEquipmentType',
        'deleteEquipmentType'
      ]),
  
      // Fetch all equipment types
      initialize() {
        this.getAllEquipmentTypes();
      },
  
      // Open the dialog for creating a new equipment type
      openCreateDialog() {
        this.dialogMode = 'create';
        this.resetForm();
        this.dialog = true;
      },
  
      // Open the dialog for editing an existing equipment type
      openEditDialog(item) {
        this.dialogMode = 'edit';
        this.form = { ...item };
        this.dialog = true;
      },
  
      // Close the dialog
      closeDialog() {
        this.dialog = false;
        this.resetForm();
      },
  
      // Reset the form
      resetForm() {
        this.form = {
          equipment_type_id: null,
          equipment_type_name: ''
        };
      },
      goToEquipmentPage(){
        this.$router.push('/equipment');
      },
  
      // Save (create or update) equipment type
      async saveEquipmentType() {
        if (this.dialogMode === 'create') {
          await this.createEquipmentType({ equipment_type_name: this.form.equipment_type_name });
        } else if (this.dialogMode === 'edit') {
          await this.updateEquipmentType(this.form);
        }
        this.closeDialog();
      },
  
      // Delete an equipment type
      async deleteItem(item) {
        if (confirm('Are you sure you want to delete this equipment type?')) {
          await this.deleteEquipmentType({ equipment_type_id: item.equipment_type_id });
        }
      }
    },
    mounted() {
      this.initialize();
    }
  };
</script>
  
<style scoped>
  .equipment-form {
    margin-bottom: 20px;
  }
</style>
  