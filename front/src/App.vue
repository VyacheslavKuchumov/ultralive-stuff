<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>Ultralive Test</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/equipment">Оборудование</v-btn>
      <v-btn text to="/shooting">Съёмка</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
      
    </v-main>
  </v-app>
</template>

<script>
import {mapActions, mapState} from 'vuex';
export default{

  methods:{
    ...mapActions({
      logout:'auth/logout'
    })
  },
  mounted() {
    const uid = localStorage .getItem('uid')
    uid ? this.$store.commit('auth/setAuth', true) : this.$store.commit('auth/setAuth', false)
  },
  computed:{
    ...mapState({
      isAuth: state => state.auth.isAuth
    })
  }
}
</script>

<style>

</style>
