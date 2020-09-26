<template>
  <div class="create_post">
    <h1>Editar Postagem</h1>
    <v-alert dismissible dense outlined type="error" v-if="alertShow">{{this.alertMessage}}</v-alert>
    <form @submit.prevent="edit">
      <v-text-field label="Título" color="black" v-model="title"></v-text-field>
      <v-text-field label="Descrição" color="black" v-model="description"></v-text-field>
      <v-text-field label="Slug" color="black" v-model="slug"></v-text-field>
      <v-textarea box label="Conteúdo" auto-grow color="black" v-model="content"></v-textarea>
      <v-text-field label="Imagem (opcional)" color="black" v-model="img" ></v-text-field>
      <v-text-field label="Autor (opcional)" color="black" style="width: 300px" v-model="imgOwner"></v-text-field>
      <v-btn dark type="submit" class="mt-2">
        <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>Editar
      </v-btn>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "EditPost",
  data() {
    return {
      title: "",
      description: "",
      content: "",
      img: "",
      slug: this.$route.query.slug,
      imgOwner: "",
      alertShow: false,
      alertMessage: "",
    };
  },
  methods: {
    async edit() {
      let post = {
        title: this.title,
        description: this.description,
        slug: this.slug,
        content: this.content,
        img: this.img,
        imgOwner: this.imgOwner
      };
      await axios({
        url: `http://localhost:3000/posts/edit/${this.slug}`,
        method: "POST",
        data: post,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then(() => {
            this.$router.push('/')
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
  async mounted() {
      await axios({url: `http://localhost:3000/posts/edit/${this.slug}`, method:'GET',headers: {
          Authorization: localStorage.getItem("token"),
        },}).then(res =>{
            this.title = res.data.title;
            this.description = res.data.description;
            this.slug = res.data.slug;
            this.content = res.data.content;
            this.img = res.data.img;
            this.imgOwner = res.data.imgOwner;
        })
  }
};
</script>

<style>
.create_post {
  margin: 2rem auto;
  width: 90%;
  min-width:400px;
  border: 1px solid gray;
}

.create_post h1{
  background-color: #FF4433;
  font-size: 3rem;
  text-align: center;
}

.create_post form{
  padding:2rem;
}

</style>