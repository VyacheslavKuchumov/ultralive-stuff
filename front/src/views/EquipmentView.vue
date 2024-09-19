<template>
  <v-card class="elevation-5 mt-5">
    <v-data-table v-if="equipment" :headers="headers" :items="equipment">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Оборудование</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn class="mb-2" color="primary" dark @click="goToCreatePage">
            Новое оборудование
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action_edit="{ item }">
        
          <v-btn class="mr-5" size="small" color="blue-darken-1" @click="goToEditPage(item)">
          <v-icon>mdi-pencil</v-icon>
          </v-btn>

      </template>
      <template v-slot:item.action_delete="{ item }">

        <v-btn size="small" color="red-darken-1" @click="deleteItem(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
    </template>
      <template v-slot:no-data>
        Нет данных
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  computed: {
    ...mapState('equipment', ['equipment']),
    headers() {
      return [
        
        { title: 'Название оборудования', key: 'equipment_name' },
        { title: 'Серийный номер', key: 'serial_number' },
        { title: 'Место хранения', key: 'place_of_storage' },
        { title: 'Текущее место хранения', key: 'current_place_of_storage' },
        { title: 'Требует обслуживания', key: 'needs_maintenance' },
        { title: 'Дата покупки', key: 'date_of_purchase' },
        { title: 'Стоимость покупки', key: 'cost_of_purchase' },
        { title: 'Изменить', key: 'action_edit', sortable: false },
        { title: 'Удалить', key: 'action_delete', sortable: false },
      ];
    },
  },
  methods: {
    ...mapActions('equipment', ['getAllEquipment', 'deleteEquipment']),
    initialize() {
      this.getAllEquipment();
    },
    goToCreatePage() {
      this.$router.push('/equipment/create');
    },
    goToEditPage(item) {
      this.$router.push(`/equipment/edit/${item.equipment_id}`);
    },
    deleteItem(item) {
      console.log(item)
      this.deleteEquipment(item); // Pass the entire object, including `id`
    },
  },
  beforeMount() {
    this.getAllEquipment();
  },
};
</script>
