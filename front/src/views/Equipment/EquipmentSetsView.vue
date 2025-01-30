<template>

  <v-card max-width="800" class="elevation-0 mt-5 ml-auto mr-auto">
      <v-card-title
        align="center" class="text-wrap">
        Комплекты оборудования
      </v-card-title>
    
  </v-card>
  <v-container v-if="equipmentSets()" max-width="1400">
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="filteredEquipmentSets"
          :group-by="groupBy"
          item-value="id"
          class="elevation-1"
          style="table-layout: auto; width: auto"
          :items-per-page="-1"
          fixed-header
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-btn icon="mdi-keyboard-backspace" color="primary" to="/"></v-btn>
              
              
              <v-spacer></v-spacer>
              
              
              <v-btn v-if="search" icon="mdi-filter" color="red" @click="searchDialog = !searchDialog"></v-btn>
              <v-btn v-else icon="mdi-filter" color="grey" @click="searchDialog = !searchDialog"></v-btn>
              <v-btn icon="mdi-plus" color="primary" @click="openDialog()"></v-btn>
            </v-toolbar>
          </template>

          <template
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
                <span>{{ item.value }}</span>
              </td>
            </tr>
          </template>

          <template v-slot:item.status="{ item }">
            <v-icon color="yellow" v-if="checkStorage(item.equipment_set_id)">mdi-warehouse</v-icon>
            <v-icon color="orange" v-if="checkMaintenance(item.equipment_set_id)">mdi-tools</v-icon>

          </template>

          <template v-slot:item.actions_see_equipment="{ item }">
            <v-btn
              size="small"
              color="secondary"
              @click="goToSetEquipment(item)"
              
            ><v-icon>mdi-camera</v-icon></v-btn>
          </template>
          <template v-slot:item.actions_edit="{ item }">
            <v-btn size="small" color="blue-darken-1" @click="openDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <template v-slot:item.actions_delete="{ item }">
            <v-btn
              size="small"
              color="red-darken-1"
              @click="confirmDelete(item.equipment_set_id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Диалог добавления/изменения комплекта -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >{{
              form.equipment_set_id ? "Изменить" : "Добавить"
            }}
            комплект</span
          >
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.equipment_set_name"
            label="Введите название комплекта"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.description"
            label="Введите описание комплекта"
            required
          ></v-text-field>
          <v-autocomplete
            v-model="form.set_type_name"
            label="Введите вид комплекта"
            :items="setTypeNames()"
            clearable
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()">Отменить</v-btn>
          <v-btn color="primary" @click="saveItem()">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Подтвердите удаление</v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить этот комплект?
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
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      searchDialog: false,
      dialog: false,
      confirmDeleteDialog: false,
      equipmentSetToDelete: null,
      search: "",
      form: {
        equipment_set_id: null,
        equipment_set_name: "",
        set_type_name: "",
        description: "",
      },
      headers: [
        { title: "", key: "status", sortable: false },
        { title: "Название", value: "equipment_set_name", sortable: true },
        { title: "Описание", value: "description", sortable: false },
        { title: "", key: "actions_see_equipment", sortable: false },
        { title: "", key: "actions_edit", sortable: false },
        { title: "", key: "actions_delete", sortable: false },
      ],
    };
  },
  computed: {
    
    

    groupBy() {
      return [
        { key: "type.set_type_name", order: "asc" },
      ];
    },
    filteredEquipmentSets() {
      if (!this.search) return this.equipmentSets();
      return this.equipmentSets().filter((item) =>
        item.equipment_set_name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    equipmentSets() {
      return this.$store.state.equipment_set.equipment_sets;
    },

    maintanenceSets() {
      return this.$store.state.equipment_set.maintenance_sets;
    },

    storageSets() {
      return this.$store.state.equipment_set.storage_sets;
    },

    setTypeNames() {
      return this.$store.state.set_types.setTypeNames;
    },
    
    ...mapActions({
      getAllEquipmentSets: "equipment_set/getAllEquipmentSets",
      createEquipmentSet: "equipment_set/createEquipmentSet",
      updateEquipmentSet: "equipment_set/updateEquipmentSet",
      deleteEquipmentSet: "equipment_set/deleteEquipmentSet",
      getSetTypeNames: "set_types/getSetTypeNames",

      getMaintenanceSets: "equipment_set/getMaintenanceSets",
      getStorageSets: "equipment_set/getStorageSets",
    }),

    openDialog(item = null) {
      this.form = item
        ? { ...item, set_type_name: item.type.set_type_name }
        : { equipment_set_id: null, equipment_set_name: "", set_type_name: "", description: "" };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveItem() {
      if (this.form.equipment_set_id) {
        await this.updateEquipmentSet(this.form);
      } else {
        await this.createEquipmentSet(this.form);
      }
      this.closeDialog();
    },
    confirmDelete(id) {
      this.equipmentSetToDelete = id;
      this.confirmDeleteDialog = true;
    },
    closeConfirmDialog() {
      this.confirmDeleteDialog = false;
      this.equipmentSetToDelete = null;
    },
    async deleteConfirmed() {
      if (this.equipmentSetToDelete) {
        await this.deleteEquipmentSet({ equipment_set_id: this.equipmentSetToDelete });
      }
      this.closeConfirmDialog();
    },
    goToSetEquipment(item) {
      this.$router.push(`/equipment/${item.equipment_set_id}`);
    },
    checkMaintenance(item) {
      
      const maintanenceIds = this.maintanenceSets().map((set) => set.equipment_set_id);
      console.log(`${maintanenceIds} ${item} ${maintanenceIds.includes(item)}`);
      const out = maintanenceIds.includes(item)
      return out;
    }, 
    checkStorage(item) {
      const storageIds = this.storageSets().map((set) => set.equipment_set_id);
      console.log(storageIds);
      return storageIds.includes(item);
    },
  },
  async beforeMount() {
    await this.getMaintenanceSets();
    await this.getStorageSets();
    await this.getAllEquipmentSets();
    await this.getSetTypeNames();
    
  },
};
</script>
