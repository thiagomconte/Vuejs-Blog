<template>
<div class="testeee">
  <div class="post-header">
    <v-alert dismissible dense outlined type="error" v-if="alertShow">{{this.alertMessage}}</v-alert>
    <v-alert dismissible dense outlined type="success" v-if="successShow">{{this.successMessage}}</v-alert>
    <div class="posts" v-for="postagem in postagens" :key="postagem._id">
      <div class="img-info">
        <router-link :to="{path: '/post', query:{slug: postagem.slug}}">
          <img :src="postagem.img" alt />
        </router-link>
        <span class="autorFoto">Foto: {{postagem.imgOwner}}</span>
      </div>
      <div class="post-info">
        <router-link class="router-link" :to="{path: '/post', query:{slug: postagem.slug}}">
          <h2>{{postagem.title}}</h2>
        </router-link>
        <span>{{moment(postagem.created_at).format('DD MMMM YYYY hh:mm a')}}</span>
        <div class="content">{{postagem.description}}</div>
      </div>
      <div class="managa-post">
        <router-link :to="{path: '/editpost', query:{slug: postagem.slug}}" v-if="isAdmin">Editar</router-link>
        <form @submit.prevent="deletePost(postagem.slug)" v-if="isAdmin">
          <button type="submit">Deletar</button>
        </form>
      </div>
      <hr />
    </div>
    
  </div>
    <v-pagination class="pag" v-if="this.postsLen > 5"
      v-model="page"
      :length="this.navLen"
      :total-visible="5"
      dark
    ></v-pagination>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "Home",
  watch:{
    page: {
      handler(){
        this.loadPosts()
      }
    }
  },
  data() {
    return {
      page:1,
      postsLen: 0,
      navLen: 0,
      postagens: [
        {
          title: "",
          description: "",
          slug: "",
          created_at: null,
          img: "",
          imgOwner: "",
        },
      ],
      alertShow: false,
      alertMessage: "",
      successShow: false,
      successMessage: "",
    };
  },
  methods: {
    moment: function () {
      return moment();
    },
    async loadPosts() {
      await axios({ url: `http://localhost:3000/posts/${this.page}`, method: "GET" }).then(
        (res) => {
          this.postsLen = parseInt(res.data.tam)
          this.navLen = Math.ceil(this.postsLen/5)  
          this.postagens = res.data.posts;
        }
      );
    },
    async deletePost(prop) {
      await axios({
        url: `http://localhost:3000/posts/delete/${prop}`,
        method: "POST",
        headers: { Authorization: localStorage.getItem("token") },
      })
        .then((res) => {
          this.successMessage = res.data;
          this.successShow = true;
          setTimeout(() => {
            this.successShow = false;
          }, 7000);
          this.loadPosts();
        })
        .catch((error) => {
          this.alertMessage = error.response.data;
          this.alertShow = true;
          setTimeout(() => {
            this.alertShow = false;
          }, 7000);
        });
    },
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
  mounted: function mounted() {
    this.loadPosts();
  },
};
</script>

<style>
.posts {
  background: rgba(255, 255, 255, 0.91);
  display: flex;
  margin: 0 auto;
  margin-bottom: 5rem;
  width: 90%;
}

.posts .img-info {
  display: flex;
  flex-direction: column;
}

.posts .post-info {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
}

.posts .post-info h2 {
  font-size: 1.8rem;
  color: #ff4433;
  margin-top: 0;
}

.router-link {
  text-decoration: none;
}

.posts .post-info h2:hover {
  opacity: 0.85;
}

.posts .post-info span {
  opacity: 0.75;
}

.posts img {
  height: 13rem;
  width: 17rem;
  /* image-rendering: auto;
  image-rendering: crisp-edges;
  image-rendering: pixelated; */
}

.pag{
  margin-bottom: 1rem;
}

@media (max-width: 760px) {
  .posts {
    background: rgba(255, 255, 255, 0.91);
    display: flex;
    flex-direction: column;
    margin: 2rem auto;
    width: 100%;
  }

  .posts .img-info {
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
  }

  .posts .post-info {
    display: flex;
    flex-direction: column;
    margin: 1rem auto;
  }

  .posts .post-info h2 {
    font-size: 1.8rem;
    color: #ff4433;
    margin-top: 0;
  }

  .posts span {
    color: black;
    opacity: 0.85;
  }

  .posts .post-info h2:hover {
    opacity: 0.85;
  }

  .posts .post-info span {
    opacity: 0.75;
    margin-bottom: 1.5rem;
  }

  .router-link:hover {
    text-decoration: none;
  }

  .posts img {
    height: 12rem;
    width: 97%;
    image-rendering: auto;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
  }
}
</style>