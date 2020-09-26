<template>
<div class="admin">
  <v-alert dismissible dense outlined type="error" v-if="alertShow">{{this.alertMessage}}</v-alert>
  <v-alert dismissible dense outlined type="success" v-if="successShow">{{this.successMessage}}</v-alert>
  <v-data-table :headers="headers" :items="desserts" sort-by="calories" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>USUÁRIOS</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                     <v-select :items="['Administrador', 'Usuário']" v-model="editedItem.isAdmin" label="Nível de Autorização"></v-select>
                    <!-- <v-text-field v-model="editedItem.isAdmin" label="Nível de Autorização"></v-text-field> -->
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click.prevent="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click.prevent="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getUsers">Reset</v-btn>
    </template>
  </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Admin",
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: "Nome",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Email", value: "email" },
        { text: "Nível", value: "isAdmin" },
        { text: "Actions", value: "actions" }
      ],
      desserts: [
        {
          _id: "",
          name: "",
          email: "",
          isAdmin: '',
        },
      ],
      editedIndex: -1,
      editedItem: {
        _id:"",
        name: "",
        email: "",
        isAdmin: '',
      },
      defaultItem: {
        _id:"",
        name: "",
        email: '',
        isAdmin: '',
      },
      alertShow: false,
      alertMessage: "",
      successShow: false,
      successMessage: "",
    };
  },
  methods: {
    async getUsers() {
      await axios({
        url: "http://localhost:3000/admin/users",
        method: "GET",
        headers: { Authorization: localStorage.getItem("token") },
      })
        .then((res) => {
          res.data.map(( user ) =>{
            user.isAdmin ? user.isAdmin = 'Administrador' : user.isAdmin = 'Usuário'
          })
          this.desserts = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.desserts.indexOf(item);
      confirm("Tem certeza que deseja deletar este usuário?") &&
        await axios({url:'http://localhost:3000/admin/deleteuser', method:'POST', data:{id: this.desserts[index]._id},
        headers: { Authorization: localStorage.getItem("token") }}).then( res => {
          this.successMessage = res.data;
          this.successShow = true;
          setTimeout(() => {
            this.successShow = false;
          }, 7000);
          this.getUsers()
        }).catch( error => {
          this.alertMessage = error.response.data;
          this.alertShow = true;
          setTimeout(() => {
            this.alertShow = false;
          }, 7000);
        })
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
        let admin = false
        this.desserts[this.editedIndex].isAdmin ? admin = true : admin = false
        await axios({url:'http://localhost:3000/admin/options/changerole', method:'POST', data:{id: this.desserts[this.editedIndex]._id, isAdmin: admin},
        headers: { Authorization: localStorage.getItem("token")}}).then( res =>{
          this.successMessage = res.data;
          this.successShow = true;
          setTimeout(() => {
            this.successShow = false;
          }, 7000);
        }).catch( error =>{
          this.alertMessage = error.response.data;
          this.alertShow = true;
          setTimeout(() => {
            this.alertShow = false;
          }, 7000);
        });
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>

<style>
.admin {
  text-align: center;
}
</style>