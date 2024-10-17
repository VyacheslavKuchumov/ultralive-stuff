<template>
  
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Новое оборудование</span>
        
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field clearable v-model="newEquipment.equipment_name" label="Название оборудования" />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field clearable v-model="newEquipment.serial_number" label="Серийный номер" />
            </v-col>
            
            <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                clearable
                label="Название комплекта"
                v-model="newEquipment.equipment_set_name"
                :items="equipmentSetsNames"
                
              ></v-autocomplete>
            </v-col>
            
            <v-col cols="12" md="6" sm="6">
              <v-autocomplete
                clearable
                v-model="newEquipment.warehouse_name"
                :items="warehouseNames"
                label="Место хранения"                
              ></v-autocomplete>
            </v-col>
            <!-- <v-col cols="12" md="6" sm="6">
              <v-switch v-model="newEquipment.needs_maintenance" label="Требует обслуживания" />
            </v-col> -->
            <v-col cols="12" md="6" sm="6">
              <v-text-field
                clearable
                prepend-icon="mdi-calendar"
                label="Дата покупки"
                v-model="newEquipment.date_of_purchase"
                @click="dialog = true"
              />
              <v-dialog v-model="dialog" width="400px">
                <v-card>
                  <v-date-picker v-model="datePickerDate" />
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialog = false">Закрыть</v-btn>
                    <v-btn text color="primary" @click="updateDate">OK</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field clearable v-model="newEquipment.cost_of_purchase" label="Стоимость покупки" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" @click="cancel">Отменить</v-btn>
        <v-btn color="blue-darken-1" @click="save">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      dialog: false,
      datePickerDate: new Date(),
      newEquipment: {
        equipment_name: '',
        serial_number: '',
        equipment_set_name: '', // Changed to hold the selected equipment type object
        warehouse_name: '', // Changed to hold the selected warehouse object
        needs_maintenance: false,
        date_of_purchase: '',
        cost_of_purchase: '',
      },
      warehouseNames: [],
      equipmentSetsNames: [] 
    };
  },
  computed: {
    ...mapState('equipment_set', ['equipment_sets']),
    ...mapState('warehouse', ['warehouses']),
  },
  methods: {
    ...mapActions('equipment', ['createEquipment']),
    ...mapActions('equipment_set', ['getAllEquipmentSets']),
    ...mapActions('warehouse', ['getAllWarehouses']),

    // Updating the date using date picker
    updateDate() {
      const date = new Date(this.datePickerDate);
      this.newEquipment.date_of_purchase = date.toISOString().split('T')[0]; // Converts to 'YYYY-MM-DD'
      this.dialog = false;
    },


    // Save method
    save() {
      
      this.createEquipment(this.newEquipment);
      console.log(this.newEquipment.equipment_set_name);
      
      this.$router.push('/equipment');
    },

    cancel() {
      this.$router.push('/equipment');
    },

    
  },
  async beforeMount() {
    await this.getAllWarehouses();
    await this.getAllEquipmentSets();
    
    // эту хуйню закинуть в стор
    this.warehouses.forEach(element => {
      this.warehouseNames.push(element.warehouse_name)
    });

    this.equipment_sets.forEach(element => {
      this.equipmentSetsNames.push(element.equipment_set_name)
    });
  },
};
</script>
