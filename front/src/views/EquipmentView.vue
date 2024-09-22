<template>
  <v-card class="elevation-5 mt-5">
    <v-data-table
      v-if="equipment"
      :group-by="groupBy"
      :headers="headers"
      :items="equipment"
    >
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

      <!-- Group header template -->
      <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
        <tr>
          <td :colspan="columns.length" @click="toggleGroup(item)">
            <v-btn
              :icon="isGroupOpen(item) ? '$expand' : '$next'"
              size="small"
              variant="text"
              
            ></v-btn>
            {{ item.value }}
          </td>
        </tr>
      </template>

      <!-- Row templates -->
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

      <template v-slot:no-data>Нет данных</template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('equipment', ['equipment']),
    headers() {
      return [
        { title: 'Название', key: 'equipment_name' },
        { title: 'Серийный номер', key: 'serial_number' },
        { title: 'Место хранения', key: 'equipmentToPlaceOfStorage.warehouse_name' },
        { title: 'Текущее место хранения', key: 'current_place_of_storage' },
        { title: 'Требует обслуживания', key: 'needs_maintenance' },
        { title: 'Дата покупки', key: 'date_of_purchase' },
        { title: 'Стоимость покупки', key: 'cost_of_purchase' },
        { title: 'Изменить', key: 'action_edit', sortable: false },
        { title: 'Удалить', key: 'action_delete', sortable: false },
      ];
    },
    groupBy() {
      return [
        {
          key: 'equipmentToEquipmentType.equipment_type_name',
          order: 'asc',
        },
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
      console.log(item);
      this.deleteEquipment(item);
    },
  },
  beforeMount() {
    this.getAllEquipment();
  },
};
</script>
