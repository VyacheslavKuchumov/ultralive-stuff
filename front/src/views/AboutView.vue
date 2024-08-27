<template>
  <div class="about">
    {{ user }}
  <img src="" alt="" srcset="">
  </div>
</template>

<script>
import PostCreate from '@/components/PostCreate.vue';
import PostList from '@/components/PostList.vue';
import { mapActions, mapState } from 'vuex';
export default {
  name: 'about-view',
  data() {
    return {
      posts: []
    }
  },
  computed: {
    user() {
      return this.$store.state.stuff.data
    }
  },
  methods: {
    ...mapActions({
      getUserByUid: 'stuff/getUserStuff'
    }),
    createPost(post) {
      this.posts.unshift(post)
    }

  },
  components: {
    PostCreate,
    PostList
  },
  beforeMount() {
    this.getUserByUid()
  }
}
</script>
<style>
.post-create-form {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 50%;
  margin: auto;
}

textarea {
  resize: none;
  font-style: normal;
}

.post-create-input {
  margin: 5px;
  border-radius: 10px;
  padding: 10px;
}

.post-create-button {
  width: 25%;
  height: 25%;
  margin: auto;
  border-radius: 10px;
  padding: 10px;
  background-color: #bcf8dd;
  font-style: monospace;
}

.post-create-button:hover {
  background-color: #42b983;
  cursor: pointer;
}

.post-list {
  display: flex;
  flex-direction: column;
  width: 50vw;
  margin: auto;
  margin-top: 20px;
  row-gap: 15px;
}

.post-item {
  display: flex;
  flex-direction: column;
  background-color: #42b983;
  border-radius: 10px;
  padding: 10px;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
}

.post-item-title {
  font-size: 1.4rem;
}

.post-item-body {
  font-size: 0.9rem;
  width: 100%;
  word-wrap: break-word;
  text-align: left;
}
</style>