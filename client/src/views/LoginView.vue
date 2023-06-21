<script>
import { mapWritableState, mapActions } from 'pinia'
import { useCustomerStore } from '../stores/customer'
import LoginForm from '../components/LoginForm.vue'

export default {
  data() {
    return {
      displayRegister: 'display:none',
      displayLogin: 'display:inline',
      displaybtn: 'left:110px'
    }
  },
  components: {
    LoginForm
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['loginData', 'isLogin', 'registerData'])
  },
  methods: {
    ...mapActions(useCustomerStore, ['login', 'registration', 'googleLogin']),
    loginProcess: async function () {
      try {
        const response = await this.login()
        localStorage.setItem('access_token', response.data.access_token)
        this.isLogin = true
        this.$router.push('/')
        this.$swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Logged In',
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        this.$swal.fire({
          icon: 'error',
          title: error.response.data.message,
          text: 'Something went wrong!'
        })
      }
    },
    registerProcess: async function () {
      try {
        const response = await this.registration()
        this.$swal.fire({
          icon: 'success',
          title: 'Success to register account',
          showConfirmButton: false,
          timer: 1500
        })
        this.slideLogin()
      } catch (error) {
        if (Array.isArray(error.response.data.message)) {
          this.$swal.fire({
            icon: 'error',
            title: error.response.data.message.join('\n')
          })
        } else {
          this.$swal.fire({
            icon: 'error',
            title: error.response.data.message
          })
        }
      }
    },
    slideRegister: function () {
      this.displayRegister = 'display:inline'
      this.displayLogin = 'display:none'
      this.displaybtn = 'left:0px'
    },
    slideLogin: function () {
      this.displayRegister = 'display:none'
      this.displayLogin = 'display:inline'
      this.displaybtn = 'left:110px'
    }
  }
}
</script>

<template>
  <section>
    <div class="login-register-body" style="background-size: cover">
      <div class="container">
        <div class="login-register">
          <div id="btn" v-bind:style="displaybtn"></div>
          <button type="button" class="toggle-btn" v-on:click="slideRegister">Register</button>
          <button type="button" class="toggle-btn" v-on:click="slideLogin">Login</button>
        </div>

        <form v-bind:style="displayLogin" v-on:submit.prevent="loginProcess">
          <div class="user-details">
            <div class="input-box" style="width: 100%">
              <span class="input-details">Email</span>
              <input type="text" placeholder="Email" v-model="loginData.email" />
            </div>
            <div class="input-box" style="width: 100%">
              <span class="input-details">Password</span>
              <input type="password" placeholder="Password" v-model="loginData.password" />
            </div>
          </div>
          <div class="button">
            <button type="submit" class="button-submit">Login</button>
          </div>
        </form>

        <form v-bind:style="displayRegister" v-on:submit.prevent="registerProcess">
          <div class="user-details">
            <div class="input-box">
              <span class="input-details">Email</span>
              <input type="text" placeholder="Email" v-model="registerData.email" />
            </div>
            <div class="input-box">
              <span class="input-details">Password</span>
              <input type="password" placeholder="Password" v-model="registerData.password" />
            </div>
            <div class="input-box">
              <span class="input-details">Phone Number</span>
              <input type="text" placeholder="Phone Number" v-model="registerData.phoneNumber" />
            </div>
            <div class="input-box">
              <span class="input-details">Address</span>
              <input type="text" placeholder="Address" v-model="registerData.address" />
            </div>
          </div>
          <div class="button">
            <button type="submit" class="button-submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style></style>
