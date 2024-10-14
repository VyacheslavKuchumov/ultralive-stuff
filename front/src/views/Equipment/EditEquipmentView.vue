<template>
    <v-container v-if="editedItem">
      <v-card>
        <v-card-title>
          <span class="text-h5">Изменить оборудование "{{ editedItem.equipment_name  }}"</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="editedItem.equipment_name" label="Название оборудования"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="editedItem.serial_number" label="Серийный номер"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="editedItem.place_of_storage" label="Место хранения"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="editedItem.current_place_of_storage" label="Текущее место хранения"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-switch v-model="editedItem.needs_maintenance" label="Требует обслуживания"></v-switch>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  prepend-icon="mdi-calendar"
                  label="Дата покупки"
                  v-model="editedItem.date_of_purchase"
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
                <v-text-field v-model="editedItem.cost_of_purchase" label="Стоимость покупки"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          
          <v-btn color="blue-darken-1" variant="text" @click="save">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { mapActions, mapState } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  
  export default {
    data() {
      return {
        menu: false,
        editedItem: null,
        datePickerDate: Date(),
      };
    },
    computed: {
      ...mapState('equipment', ['equipment']),
    },
    methods: {
      ...mapActions('equipment', ['updateEquipment', 'getEquipmentByID']),
      async save() {
        await this.updateEquipment(this.editedItem);
        this.$router.push('/equipment');
      },
      cancel() {
        this.$router.push('/equipment');
      },
      updateDate() {
        // Format the date using native Date() methods
        const date = new Date(this.datePickerDate);
        this.editedItem.date_of_purchase = date.toLocaleDateString('ru-RU'); // Customize formatting
        
        this.dialog = false;
        },
    },
    async created() {
      const route = useRoute();
      const equipmentId = route.params.id;
      await this.getEquipmentByID(equipmentId)
      this.editedItem = this.equipment
      console.log(this.editedItem)
    },
  };
  </script>
  