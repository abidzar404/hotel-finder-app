<script>
import { mapActions, mapState, mapWritableState } from 'pinia'
import { RouterLink, RouterView } from 'vue-router'
import { useCustomerStore } from './stores/customer'

export default {
  components: {
    RouterLink,
    RouterView
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['isLogin'])
  },
  methods: {
    ...mapActions(useCustomerStore, ['signOut'])
  },
  created() {
    if (localStorage.getItem('access_token')) {
      this.isLogin = true
    }
  }
}
</script>

<template>
  <nav>
    <RouterLink to="/"
      ><label class="logo" style="cursor: pointer">Hotel Finder</label></RouterLink
    >
    <ul>
      <li>
        <RouterLink to="/" style="cursor: pointer">Home</RouterLink>
      </li>
      <!-- <li>
        <RouterLink to="/bookTicket" style="cursor: pointer">My Ticket</RouterLink>
      </li> -->
      <li>
        <RouterLink to="/login" style="cursor: pointer" v-if="!isLogin">Sign In</RouterLink>
      </li>
      <li>
        <RouterLink to="/login" style="cursor: pointer" v-if="isLogin" v-on:click="signOut"
          >Sign Out</RouterLink
        >
      </li>
    </ul>
  </nav>

  <RouterView></RouterView>
</template>

<style>
@import './assets/style.css';
</style>
