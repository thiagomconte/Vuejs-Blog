<template>
  <div class="create_post">
    <h1>Adicionar Postagem</h1>
    <v-alert dismissible dense outlined type="error" v-if="alertShow">{{this.alertMessage}}</v-alert>
    <v-alert dismissible dense outlined type="success" v-if="successShow">{{this.successMessage}}</v-alert>
    <form @submit.prevent="create">
      <v-text-field label="Título" color="black" v-model="title"></v-text-field>
      <v-text-field label="Descrição" color="black" v-model="description"></v-text-field>
      <v-text-field label="Slug" color="black" v-model="slug"></v-text-field>
      <v-textarea filled label="Conteúdo" auto-grow color="black" v-model="content"></v-textarea>
      <v-text-field label="Imagem" color="black" v-model="img" ></v-text-field>
      <v-text-field label="Autor" color="black" style="width: 300px" v-model="imgOwner"></v-text-field>
      <v-btn dark type="submit" class="mt-2">
        <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>Adicionar
      </v-btn>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CreatePost",
  data() {
    return {
      title: "",
      description: "",
      slug: "",
      content: "",
      img: "",
      imgOwner: "",
      alertShow: false,
      alertMessage: "",
      successShow: false,
      successMessage: "",
    };
  },
  methods: {
    clear() {
      this.title = "";
      this.description = "";
      this.slug = "";
      this.content = "";
      this.img = "";
      this.imgOwner = ""
    },
    async create() {
      let post = {
        title: this.title,
        description: this.description,
        slug: this.slug,
        content: this.content,
        img: this.img,
        imgOwner: this.imgOwner
      };
      await axios({
        url: "http://localhost:3000/posts/create",
        method: "POST",
        data: post,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => {
          this.clear();
          this.successMessage = res.data;
          this.successShow = true;
          setTimeout(() => {
            this.successShow = false;
          }, 7000);
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