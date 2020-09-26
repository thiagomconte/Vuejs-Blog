<template>
  <div class="Post">
    <div class="post-area">
      <div class="post-header">
        <h1>{{this.title}}</h1>
        <hr />
        <span>
          <strong>Publicado em:</strong>
          {{moment(this.created_at).format('DD MMMM YYYY hh:mm a')}}
        </span>
        <h4>{{this.description}}</h4>
        <hr />
      </div>
      <div class="post-content">{{this.content}}</div>
      <br>
    </div>
    <Comment v-if="isMounted" :postId="this.id" />
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Comment from "../components/Comment";
export default {
  name: "Post",
  components: {
    Comment,
  },
  data() {
    return {
      id: "",
      title: "",
      description: "",
      content: "",
      created_at: null,
      isMounted: false
    };
  },
  methods: {
    moment: function () {
      return moment();
    },
  },
  async mounted() {
    await axios({
      url: `http://localhost:3000/posts/post/${this.$route.query.slug}`,
      method: "GET",
    }).then((res) => {
      this.id = res.data._id;
      this.title = res.data.title;
      (this.description = res.data.description),
        (this.created_at = res.data.created_at),
        (this.content = res.data.content);
    });
    this.isMounted = true;
  },
};
</script>

<style>
.post-page {
  width: 80%;
  margin: 2rem auto;
}

.post-area {
  background: rgb(245, 245, 245, 0.93);
  border-radius: 0.5rem;
}

.post-header {
  padding: 1rem 3rem;
}

.post-header h1 {
  margin: 4rem 0;
  color: #ff4433;
  font-size: 3rem;
}

.post-header span {
  color: rgba(0, 0, 0, 0.6);
  margin-left: 0;
}

.post-header h4 {
  margin: 2rem 0;
  font-size: 1.2rem;
}

.post-content {
  white-space: pre-wrap;
  padding: 1rem 3rem;
  font: 500 1rem Noto Sans JP;
  margin: 2rem auto;
  width: 90%;
}

.comment-area {
  border-radius: 0.5rem;
  padding: 1rem 3rem;
  background: rgb(245, 245, 245, 0.93);
  display: flex;
  flex-direction: column;
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

form textarea#exampleFormControlTextarea1 {
  background: transparent;
  border-radius: 0.3rem;
  border: 0.3px solid black;
  margin-top: 3rem;
  padding: 0 1rem;
  font-size: 1.3rem;
  transition: 0.2s;
}

form textarea#exampleFormControlTextarea1:focus {
  outline: none;
  border: 1px solid red;
  box-shadow: 0 0 0 0;
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

@media (max-width: 768px) {
  .post-page {
    width: 97%;
  }
  .comment-content-user {
    font-size: 0.8rem;
  }
}
</style>