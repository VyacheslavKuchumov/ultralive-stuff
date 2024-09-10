<template>
    <v-card class="elevation-5  mt-5">
      <v-data-table v-if="equipment" :headers="headers" :items="equipment">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Оборудование</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn class="mb-2" color="primary" dark v-bind="props">
                  Новое оборудование
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
  
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="editedItem.equipment_name" label="Equipment Name"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="editedItem.serial_number" label="Serial Number"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
  
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close">
                    Отменить
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="save">
                    Сохранить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">
                  Вы уверены что хотите удалить это?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="closeDelete">
                    Отменить
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">
                    OK
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn class="mr-5" size="small" color="blue-darken-1" @click="editItem(item)">Изменить</v-btn>
          <v-btn size="small" color="red-darken-1" @click="deleteItem(item)">Удалить</v-btn>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </template>
  
  <script>
  import { mapActions, mapState } from 'vuex';
  
  export default {
    data() {
      return {
        dialog: false,
        dialogDelete: false,
        editedIndex: -1,
        editedItem: {
          id: null,  // Add ID field for tracking item by ID
          equipment_name: '',
          serial_number: '',
        },
        defaultItem: {
          id: null,
          equipment_name: '',
          serial_number: '',
        },
      };
    },
    computed: {
      ...mapState('equipment', ['equipment']),
      headers() {
        return [
          { title: 'ID', key: 'id' },
          { title: 'НАЗВАНИЕ', key: 'equipment_name' },
          { title: 'СЕРИЙНЫЙ НОМЕР', key: 'serial_number' },
          { title: '', key: 'actions', sortable: false },
        ];
      },
      formTitle() {
        return this.editedIndex === -1 ? 'Новое оборудование' : 'Изменить оборудование';
      },
    },
    methods: {
      ...mapActions('equipment', ['getAllEquipment', 'createEquipment', 'updateEquipment', 'deleteEquipment']),
  
      initialize() {
        this.getAllEquipment();
      },
  
      editItem(item) {
        this.editedIndex = this.equipment.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
  
      deleteItem(item) {
        this.editedIndex = this.equipment.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },
  
      deleteItemConfirm() {
        // console.log(this.editedItem)
        this.deleteEquipment(this.editedItem);  // Pass the entire object, including `id`
        this.closeDelete();
      },
  
      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      },
  
      closeDelete() {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        });
      },
  
      save() {
        if (this.editedIndex > -1) {
          this.updateEquipment(this.editedItem);  // Pass the edited item, which contains the ID
        } else {
          this.createEquipment(this.editedItem);
        }
        this.close();
      },
    },
    beforeMount() {
      this.getAllEquipment();
    },
  };
  </script>
  