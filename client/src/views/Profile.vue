<template>
  <h1>Ola {{getName}}, esta página ainda está em desenvolvimento!</h1>
</template>

<script>
export default {
    name: 'Profile',
    computed: {
      getName(){
        return this.$store.state.user.name;
      }
    }
}
</script>

<style>

</style>