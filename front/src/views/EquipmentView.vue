<template>
    <div>
        <h2>Оборудование</h2>
        
            <v-icon icon="mdi" />
            


        <v-data-table
            :headers="headers"
            :items="equipment"
            class="elevation-1">
            
        </v-data-table>
    </div>
</template>
  
<script>
    import { mapActions, mapState } from 'vuex';
    
    export default {
        data() {
            return {
                
            };
        },
        computed: {
        ...mapState('equipment', ['equipment']),  // Correctly map the equipment state
        headers() {
            return [
                { title: 'ID', key: 'id'},
                { title: 'Название', key: 'equipment_name' },
                { title: 'Серийный номер', key: 'serial_number' },
            
            ];
        }
        },
        methods: {
        ...mapActions('equipment', ['getAllEquipment'])  // Map the getAllEquipment action from Vuex
        },
        beforeMount() {
        this.getAllEquipment();  // Fetch equipment data before the component mounts
        }
    };
</script>

  