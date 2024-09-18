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

    <v-card-text class="bg-surface-light pt-4">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!
    </v-card-text>
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