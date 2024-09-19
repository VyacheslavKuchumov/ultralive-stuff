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
                <v-text-field v-model="newEquipment.equipment_name" label="Название оборудования"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="newEquipment.serial_number" label="Серийный номер"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="newEquipment.place_of_storage" label="Место хранения"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="newEquipment.current_place_of_storage" label="Текущее место хранения"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-switch v-model="newEquipment.needs_maintenance" label="Требует обслуживания"></v-switch>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  prepend-icon="mdi-calendar"
                  label="Дата покупки"
                  v-model="newEquipment.date_of_purchase"
                  @click="dialog = true"
                  
                ></v-text-field>
                <v-dialog v-model="dialog" width="290px">
                  <v-card>
                    <v-date-picker
                      v-model="datePickerDate"

                    ></v-date-picker>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dialog = false">Закрыть</v-btn>
                      <v-btn text color="primary" @click="updateDate">OK</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="newEquipment.cost_of_purchase" label="Стоимость покупки"></v-text-field>
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
  import { mapActions } from 'vuex';
  import { useRouter } from 'vue-router';
  import { useDate } from 'vuetify';
  
  export default {
    data() {
      return {
        dialog: false,
        date: null,
        datePickerDate: Date(),
        newEquipment: {
          equipment_name: '',
          serial_number: '',
          place_of_storage: '',
          current_place_of_storage: '',
          needs_maintenance: false,
          date_of_purchase: '',
          cost_of_purchase: '',
        },
      };
    },
    methods: {
      ...mapActions('equipment', ['createEquipment']),
      updateDate() {
        // Format the date using native Date() methods
        const date = new Date(this.datePickerDate);
        this.newEquipment.date_of_purchase = date.toLocaleDateString('ru-RU'); // Customize formatting
        console.log(this.newEquipment.date_of_purchase)
        this.dialog = false;
    },

      
      async save() {
        
        await this.createEquipment(this.newEquipment);
        this.$router.push('/equipment');
      },
      cancel() {
        this.$router.push('/equipment');
      },
    },
    
  };
  </script>
  