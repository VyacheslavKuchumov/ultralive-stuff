<template>
  <v-card v-if="equipment && one_set" max-width="800" class="elevation-0 mt-5 ml-auto mr-auto">
      <v-card-title
        align="center" class="text-wrap">
        Комплект {{ one_set.equipment_set_name }}
      </v-card-title>
    
  </v-card>
  <v-card max-width="1600" class="elevation-5 mt-5 mx-auto">
    <v-data-table
      v-if="equipment && one_set"
      :headers="headers"
      :items="filteredEquipment"
      :items-per-page="-1"
      :search="search"
      class="elevation-1"
      fixed-header
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn icon="mdi-keyboard-backspace" color="primary" @click="goBack"></v-btn>
          
          
          <v-spacer></v-spacer>
          
          
          <v-btn v-if="search" icon="mdi-filter" color="red" @click="searchDialog = !searchDialog"></v-btn>
          <v-btn v-else icon="mdi-filter" color="grey" @click="searchDialog = !searchDialog"></v-btn>
          <v-btn icon="mdi-plus" color="primary" @click="goToCreatePage()"></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td align="center">
            <v-icon v-if="item.needs_maintenance" color="orange"
              >mdi-tools</v-icon
            >
            <v-icon v-if="item.current_storage" color="yellow"
              >mdi-warehouse</v-icon
            >
            
          </td>
          <td>{{ item.equipment_name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.serial_number }}</td>
          <td>{{ item.storage?.warehouse_name || "N/A" }}</td>
          <td>{{ item.current_storage || "N/A" }}</td>
          <td>{{ item.needs_maintenance ? "Да" : "Нет" }}</td>
          <td>{{ item.date_of_purchase }}</td>
          <td>{{ item.cost_of_purchase }}</td>
          <td>
            <v-btn
              class="mr-5"
              size="small"
              color="blue-darken-1"
              @click="goToEditPage(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </td>
          <td>
            <v-btn size="small" color="red-darken-1" @click="confirmDelete(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:no-data> Нет данных </template>
    </v-data-table>
  </v-card>

  <!-- Диалог подтверждения удаления -->
  <v-dialog v-model="confirmDeleteDialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h5">Подтвердите удаление</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить оборудование "{{ equipmentToDelete?.equipment_name }}"?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeConfirmDialog()">Отмена</v-btn>
        <v-btn color="red" @click="deleteConfirmed()">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="searchDialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h5">Поиск</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Поиск"
          prepend-icon="mdi-magnify"
          clearable
          placeholder="Поиск..."
        ></v-text-field>
        
      </v-card-text>
      <v-card-actions>
        
        <v-spacer></v-spacer>
        <v-btn text @click="searchDialog = false">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default {
  data() {
    return {
      searchDialog: false,
      set_id: null,
      search: "",
      confirmDeleteDialog: false,
      equipmentToDelete: null,
    };
  },
  computed: {
    ...mapState("equipment", ["equipment"]),
    ...mapState("equipment_set", ["one_set"]),
    headers() {
      return [
        { title: "", key: "status", sortable: false },
        { title: "Название", key: "equipment_name" },
        { title: "Описание", key: "description" },
        { title: "Серийный номер", key: "serial_number" },
        { title: "Место хранения", key: "storage.warehouse_name" },
        { title: "Текущее место хранения", key: "current_storage" },
        { title: "Требует обслуживания", key: "needs_maintenance" },
        { title: "Дата покупки", key: "date_of_purchase" },
        { title: "Стоимость покупки", key: "cost_of_purchase" },
        { title: "", key: "action_edit", sortable: false },
        { title: "", key: "action_delete", sortable: false },
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
    goBack() {
            this.$router.push(`/equipment_sets`);
        },
    ...mapActions("equipment", ["getEquipmentBySetID", "deleteEquipment"]),
    ...mapActions("equipment_set", ["getEquipmentSetByID"]),

    goToEditPage(item) {
      this.$router.push(`/equipment/edit/${this.set_id}/${item.equipment_id}`);
    },
    goToCreatePage() {
      this.$router.push(`/equipment/create/${this.set_id}`);
    },

    confirmDelete(item) {
      this.equipmentToDelete = item; // Сохраняем оборудование для удаления
      this.confirmDeleteDialog = true; // Открываем диалог подтверждения
    },
    closeConfirmDialog() {
      this.confirmDeleteDialog = false;
      this.equipmentToDelete = null;
    },
    deleteConfirmed() {
      if (this.equipmentToDelete) {
        this.deleteEquipment(this.equipmentToDelete); // Выполняем удаление
        this.getEquipmentBySetID(this.set_id); // Обновляем список оборудования
        window.location.href = `/equipment/${this.set_id}`;
      }
      this.closeConfirmDialog();
    },
  },

  created() {
    const route = useRoute();
    const setId = route.params.id;
    this.set_id = route.params.id;
    this.getEquipmentBySetID(setId);
    this.getEquipmentSetByID(setId);
  },
};
</script>
