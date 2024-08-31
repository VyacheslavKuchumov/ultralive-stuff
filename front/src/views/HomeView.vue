<template>
  
    
    <div class="window">
      test
    </div>
  
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
      updateLike: 'user/updateLikes',
      getUser: 'user/getUserByUid'
    }),
    addlike() {
      this.likes += 1
      if (this.uid){
        this.updateLike({likes:this.likes})
      }
    },
    adddislike() {
      this.likes -= 1
      if (this.uid){
        this.updateLike({likes:this.likes})
      }
    },
    user() {
      return this.$store.state.user.user
    }
  },
  watch: {
    likes() {
      if (this.likes < 0) {
        this.likes = 0
      }
    }
  },
  async mounted(){
    this.uid = localStorage.getItem('uid')
    this.name = localStorage.getItem('name')
    if (this.uid){
      await this.getUser()
      this.likes = this.$store.state.user.user?.likes || 0
      this.text = `вы авторизованы как ${this.user().name} 씨발`
    } else{
      this.text = 'вы не авторизованы, счетчик обнулен'
    }
  },
  components: {

  }
}
</script>

<style>
.window {
  display: flex;
  flex-direction: column;
  width: 50vw;
  
  background-color: #CCF0D3;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  padding: 20px;
  font-size: xx-large;
  font-weight: bold;
}

.label {
  font-size: 1.5rem;
}

.btns {
  display: flex;
  flex-direction: row;
  column-gap: 15px;
}

.btn {
  display: flex;
  flex-direction: row;
  padding: 5px;
  background-color: white;
  border-radius: 10px;
  align-items: center;
  column-gap: 15px;
  cursor: pointer;
}

.like {
  color: green;
}

.dislike {
  color: brown;
}
body{
  background-color:#CCF0D3; 
}
</style>