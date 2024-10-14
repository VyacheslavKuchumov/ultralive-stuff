<template>
    <v-card
    v-if="user()"
    class="mx-auto"
    prepend-icon="mdi-account"
    
    width="400"
  >
    <template v-slot:title>
      <span class="font-black">Пользователь {{ user().name }}</span>
    </template>
    <template v-slot:subtitle>
      {{user().role}} 
    </template>

    
    <v-card-title class="d-flex justify-center align-center">
      Справочники
    </v-card-title>
    <v-container class="d-flex justify-center align-center">
    
      <v-row class="d-flex flex-column align-center">
        <v-btn color="primary" class="mb-2" to="/equipment_types" width="200">
          Виды оборудования
        </v-btn>
        <v-btn color="primary" class="mb-2" to="/warehouses" width="200">
          Склады
        </v-btn>
        <v-btn color="primary" class="mb-2" to="" width="200">
          Виды проектов
        </v-btn>
        <v-btn disabled color="primary" class="mb-2" to="" width="200">
          Клиенты
        </v-btn>
        <v-btn disabled color="primary" class="mb-2" to="" width="200">
          Виды клиентов
        </v-btn>
      </v-row>
    </v-container>
  </v-card>
  

    
    
  
</template>

<script>
import {mapActions } from 'vuex'

export default {
  name: 'HomeView',
  data() {
    return {
      likes: 0,
      text: '',
      uid:'',
      name: ''
    }
  },
  methods: {

    ...mapActions({
      getUser: 'user/getUserByUid'
    }),
    
    user() {
      return this.$store.state.user.user
    }
  },
  watch: {
    
  },
  async mounted(){
    this.uid = localStorage.getItem('uid')
    
    if (this.uid){
      await this.getUser()
    
    }
  }
}
</script>

<style>
 
</style>