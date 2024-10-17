<template>
    <v-card class="elevation-5 mt-5">
      <v-data-table
        v-if="projects"
        :group-by="groupBy"
        :headers="headers"
        :items="filteredProjects"
        :items-per-page="-1"
        :search="search"
        height="400"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Проекты</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn class="mb-2" color="primary" dark to="/project_types">
              Виды проектов
            </v-btn>
            <v-btn class="mb-2" color="primary" dark to="/project/create">
              Новый проект
            </v-btn>
          </v-toolbar>
        </template>
  
        <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
          <tr>
            <td :colspan="columns.length" @click="toggleGroup(item)">
              <v-btn
                :icon="isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                size="small"
                variant="text"
                disabled
              ></v-btn>
              {{ item.value }}
            </td>
          </tr>
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
  import { mapActions, mapState } from 'vuex';
  
  export default {
    data() {
      return {
        search: '',
      };
    },
    computed: {
      ...mapState('projects', ['projects']),
      headers() {
        return [
          { title: 'Название', key: 'project_name' },
          { title: 'Тип проекта', key: 'type.project_type_name' },
          { title: 'Клиент', key: 'client.client_name' },
          { title: 'Главный инженер', key: 'chief_engineer_id' },
          { title: 'Изменить', key: 'action_edit', sortable: false },
          { title: 'Удалить', key: 'action_delete', sortable: false },
        ];
      },
      groupBy() {
        return [
          {
            key: 'shooting_date',
            order: 'asc',
          },
        ];
      },
      filteredProjects() {
        if (!this.search) {
          return this.projects;
        }
        const searchTerm = this.search.toLowerCase();
        return this.projects.filter((item) =>
          item.project_name.toLowerCase().includes(searchTerm)
        );
      },
    },
    methods: {
      ...mapActions('projects', ['getAllProjects', 'deleteProject']),
      initialize() {
        this.getAllProjects();
      },
      goToEditPage(item) {
        this.$router.push(`/project/edit/${item.project_id}`);
      },
      deleteItem(item) {
        console.log(item);
        this.deleteProject(item.project_id);
      },
    },
    beforeMount() {
      this.initialize();
    },
  };
  </script>
  