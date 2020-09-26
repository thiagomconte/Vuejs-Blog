<template>
  <div class="comment-area">
    <strong>Comentários ({{num}}):</strong>
    <v-alert dismissible dense outlined type="error" v-if="alertShow">{{this.alertMessage}}</v-alert>
    <small class="mt-2">
      Os comentários são de responsabilidade exclusiva de seus autores e não
      representam a opinião deste site.
    </small>
    <form @submit.prevent="createComment" v-if="isLoggedIn">
      <v-textarea filled label="Conteúdo" auto-grow color="black" v-model="contentInput"></v-textarea>
      <button type="submit">
        <v-icon class="cicon">mdi-comment</v-icon>Comentar
      </button>
      <hr />
    </form>
    <p v-if="!isLoggedIn">
      Para participar dos comentários faça o
      <router-link to="/login">Login</router-link> ou
      crie uma
      <router-link to="/register">Conta</router-link>
    </p>
    <div class="pai" v-if="this.postId">
      <div class="comment-content" v-for="comentario in comentarios" :key="comentario._id">
        
        <div class="comment-content-header">
          <div class="comment-content-header-info">
            <strong>
              <v-icon v-if="comentario.user_id.isAdmin">mdi-account-star</v-icon>
              {{comentario.user_id.name}}
            </strong>
            <small>{{moment(comentario.createdAt).format('DD/MM/YYYY hh:mm a')}}</small>
          </div>
          <div class="comment-content-user">{{comentario.content}}</div><form @submit.prevent="deleteComment(comentario._id)">
            <v-btn class="delbtn" dark type="submit">Deletar</v-btn>
          </form>
          <hr />
        </div>
      </div>
      <v-btn dark @click.prevent="seeMore" class="mt-2" v-if="num > 5 && limit < num">
        <v-icon class="mr-1">mdi-message-text-outline</v-icon>Carregar mais comentários...
      </v-btn>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import axios from "axios";
export default {
  name: "Comment",
  props: ["postId"],
  data() {
    return {
      post_id: this.postId,
      num: 0,
      alertShow: false,
      limit: 5,
      alertMessage: "",
      contentInput: "",
      comentarios: [
        {
          _id: '',
          user_id: {},
          createdAt: "",
          content: "",
        },
      ],
    };
  },
  methods: {
    moment: function(){
        return moment()
    }  ,
    getUserId() {
      return this.$store.state.user.id;
    },
    seeMore(){
        this.limit += 5;
        this.loadComments();
    },
    async deleteComment(id) {
      await axios({
        url: `http://localhost:3000/comments/delete`,
        method: "POST",
        data: {id},
        headers: { Authorization: localStorage.getItem("token") },
      })
        .then(() => {
          this.loadComments()
        })
        .catch((err) => {
          alert(err.response.data);
        });
    },
    async createComment() {
      let comment = {
        post_id: this.postId,
        user_id: this.getUserId(),
        content: this.contentInput,
      };
      await axios({
        url: "http://localhost:3000/comments/create",
        data: comment,
        method: "POST",
        headers: { Authorization: localStorage.getItem("token") },
      })
        .then(() => {
          this.contentInput = ''
          this.loadComments()
        })
        .catch((error) => {
          this.alertMessage = error.response.data;
          this.alertShow = true;
          setTimeout(() => {
            this.alertShow = false;
          }, 7000);
        });
    },
    async loadComments(){
        await axios({
        url: `http://localhost:3000/comments/${this.post_id}/${this.limit}`,
        method: "GET",
      }).then((res) => {
        this.comentarios = res.data.commentsFound;
        this.num = res.data.num;
        console.log(this.comentarios)
      });
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  mounted: function mounted() {
      this.loadComments()
  },
};
</script>

<style>
.comment-area {
  border-radius: 0.5rem;
  padding: 1rem 3rem;
  background: rgb(245, 245, 245, 0.93);
  display: flex;
  flex-direction: column;
}


.cicon{
    margin-right: 1rem;
}

.comment-area strong {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.comment-area hr {
  border: 1px solid black;
  margin: 2rem auto;
}

.comment-area form button {
  color: white;
  border: none;
  height: 3.5rem;
  width: 10rem;
  background: #ed213a; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #93291e,
    #ed213a
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #93291e, #ed213a);
  border-radius: 0.8em;
  margin-top: 1rem;
}
.comment-area form button img {
  margin-right: 0.5rem;
}

.comment-area form button:hover {
  background: #ed213a; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #ed213a,
    #93291e
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #ed213a, #93291e);
}

.comment-area form button:focus {
  outline: none;
}

.comment-area a {
  text-decoration: none;
  color: #ed213a;
}
.comment-area a:hover {
  color: #ed213a;
}

.comment-content {
  display: flex;
  width:80%;
  margin: 3rem auto;
}

.comment-content form button {
  width: 3.3rem;
  height: 3.3rem;
  border: none;
  background: #ed213a;
  border-radius: 1rem;
}

.comment-content form button:hover {
  background: #ed213a;
}

.comment-content form button img {
  margin: auto;
}

.comment-content {
  display: flex;
  flex-direction: column;
}

.comment-content-user {
  padding: 0.3rem 1rem;
  margin-top: 1rem;
  font: 400 1.2rem Noto Sans JP;
  white-space: pre-wrap;
}

.comment-content-header-info {
  display: flex;
  flex-direction: column;
}

.comment-area .delbtn{
  border-radius: 0;
  width: 7rem;
}

@media (max-width: 768px) {
  .comment-content-user {
    font-size: 0.8rem;
  }
  .comment-content {
  width:98%;
  margin: 2rem auto;
}
}
</style>