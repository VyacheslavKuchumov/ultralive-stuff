<template>
  <v-card width="1200" class="elevation-5 mt-5 mx-auto">
    <v-data-table
      v-if="equipment"
      :group-by="groupBy"
      :headers="headers"
      :items="filteredEquipment"
      :items-per-page="-1"
      :search="search"
      height="400"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Оборудование</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn class="mb-2" color="primary" dark to="/equipment_sets">
            Комплекты
          </v-btn>
          <v-btn class="mb-2" color="primary" dark to="/equipment/create">
            Новое оборудование
          </v-btn>
        </v-toolbar>
      </template>

      <template
        v-if="search"
        v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
      >
        <tr>
          <td :colspan="columns.length" @click="toggleGroup(item)">
            {{ isGroupOpen(item) ? "" : toggleGroup(item) }}
            <v-btn
              :icon="
                isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'
              "
              size="small"
              variant="text"
              disabled
            ></v-btn>
            {{ item.value }}
          </td>
        </tr>
      </template>

      <template
        v-if="!search"
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
            {{ item.value }}
          </td>
        </tr>
      </template>

      <template v-slot:item.action_edit="{ item }">
        <v-btn
          class="mr-5"
          size="small"
          color="blue-darken-1"
          @click="goToEditPage(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.action_delete="{ item }">
        <v-btn size="small" color="red-darken-1" @click="deleteItem(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template v-slot:no-data>Нет данных</template>

      <template v-slot:bottom>
        <v-card>
          <v-card-title>Поиск по названию</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Поиск"
              prepend-icon="mdi-magnify"
              clearable
              placeholder="Search..."
              class="mt-2"
              width="400"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      search: "",
    };
  },
  computed: {
    ...mapState("equipment", ["equipment"]),
    headers() {
      return [
        { title: "Название", key: "equipment_name" },
        { title: "Серийный номер", key: "serial_number" },
        { title: "Место хранения", key: "storage.warehouse_name" },
        { title: "Текущее место хранения", key: "current_storage" },
        { title: "Требует обслуживания", key: "needs_maintenance" },
        { title: "Дата покупки", key: "date_of_purchase" },
        { title: "Стоимость покупки", key: "cost_of_purchase" },
        { title: "Изменить", key: "action_edit", sortable: false },
        { title: "Удалить", key: "action_delete", sortable: false },
      ];
    },
    groupBy() {
      return [
        {
          key: "equipment_set.equipment_set_name",
          order: "asc",
        },
      ];
    },
    filteredEquipment() {
      if (!this.search) {
        return this.equipment;
      }
      const searchTerm = this.search.toLowerCase();
      return this.equipment.filter((item) =>
        item.equipment_name.toLowerCase().includes(searchTerm)
      );
    },
  },
  methods: {
    ...mapActions("equipment", ["getAllEquipment", "deleteEquipment"]),
    initialize() {
      this.getAllEquipment();
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
    this.initialize();
  },
};
</script>
