<template>
  <v-card class="elevation-5 mt-5">
    <v-toolbar flat>
      <v-toolbar-title>Shooting Session</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
    </v-toolbar>

    <!-- Select Equipment Section -->
    <v-card class="pa-4">
      <v-form v-if="equipment">
        <v-select
          v-model="selection"
          :items="equipment"
          item-title="equipment_name"
          item-value="id"
          label="Select an option"
          multiple
          
        ></v-select>
        <v-btn class="mt-4" color="primary" @click="addEquipmentToShooting">
          Add Equipment
        </v-btn>
      </v-form>
    </v-card>

    
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    data() {
      return {
        selection: [],
        // items: [
        //   {"id":1, "equipment_name": "test equipment"}
        // ],
        
      };
    },
    computed: {
      // Map the state to fetch equipment from Vuex store
      ...mapState('equipment', ['equipment']),

    },
    methods: {
      ...mapActions('equipment', ['getAllEquipment']), // Action to load equipment

      addEquipmentToShooting(){
        console.log(this.selection)
        this.selection = []
      }
    

      
    },
    beforeMount() {
      this.getAllEquipment()
    },
  };
</script>
