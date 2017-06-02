<template>
  <div id="app">
    <div class="app-header">
    <md-toolbar>
      <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
	<md-icon>menu</md-icon>
      </md-button>
      <h1 class="md-title">{{ $route.meta.title }}</h1>
    </md-toolbar>
    </div>

    <vue-toast ref="toast"></vue-toast>

    <div class="app-content">

      <router-view></router-view>
      <login></login>

      <!-- Menu items -->
      <md-sidenav class="md-left md-fixed" ref="leftSidenav" :md-swipeable="true">
        <md-toolbar class="lokkit-logo" md-theme="white">
          <img src="static/lokkit_icon_400.png" alt="lokkit logo"/>
          <span>Lokkit Menu</span>
        </md-toolbar>

        <div class="md-list-expand-container">
          <ul class="md-list">
            <li class="md-list-item">
              <a href="#/scanner"
                v-on:click='toggleLeftSidenav'
                class="md-list-item-container md-button">
                <md-icon><i class="mdi mdi-qrcode-scan"></i></md-icon>
                <span>Scan</span>
              </a>
            </li>
            <li class="md-list-item">
              <a href="/#"
                v-on:click='toggleLeftSidenav'
                class="md-list-item-container md-button">
                <md-icon><i class="mdi mdi-book-multiple-variant"></i></md-icon>
                <span>My lockers</span>
              </a>
            </li>
            <li class="md-list-item">
              <a href="#/accounts"
                v-on:click='toggleLeftSidenav'
                class="md-list-item-container md-button">
                <md-icon>account_box</md-icon>
                <span>Account</span>
              </a>
            </li>
            <md-divider class="md-inset"></md-divider>
            <li class="md-list-item">
              <a href=""
                v-on:click='resetLocalStorage'
                class="md-list-item-container md-button">
                <md-icon>reset</md-icon>
                <span>Reset Storage</span>
              </a>
            </li>
          </ul>
        </div>
      </md-sidenav>
      <!-- End Menu items -->
    </div>

    <div class="app-footer">
      <md-whiteframe md-elevation="15">
        <md-bottom-bar>
          <md-bottom-bar-item
            href="#/scanner"
            md-iconset="mdi mdi-qrcode-scan"
            v-bind:class="{'md-active': $route.name == 'Scanner'}">
            Scan
          </md-bottom-bar-item>
          <md-bottom-bar-item
            href="/#"
            md-iconset="mdi mdi-book-multiple-variant"
            v-bind:class="{'md-active': $route.name == 'RentableDetails' ||  $route.name == 'Rentables'}">
            Rentables
          </md-bottom-bar-item>
          <md-divider />
          <md-bottom-bar-item
            href="#/accounts"
            md-iconset="mdi mdi-account-box"
            v-bind:class="{'md-active': $route.name == 'account'}">
            My account
          </md-bottom-bar-item>
        </md-bottom-bar>
      </md-whiteframe>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Login from './components/Login.vue'

  export default {
    name: 'app',
    components: {Login},
    methods: {
      toggleLeftSidenav: function () {
        this.$refs.leftSidenav.toggle()
      },
      resetLocalStorage: function () {
        localStorage.clear()
        location.reload()
      }
    },
    computed: mapGetters(['activeAccount']),
    created () {
      this.$store.dispatch('initialize').then((msg) => {
        this.$toasted.success(msg)
      }).catch((err) => {
        this.$toasted.error(err)
      })
    }
  }
</script>

<style>
  html,
  body,
  #app,
  .app-content {
    height: 100%; /* needed for proper layout */
  }

  body {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  #app {
    display: flex;
    flex-direction: column;
  }

  .app-header {
    flex: 0 0 auto;
  }

  .app-content {
    flex: 1 1 auto;
    position: relative;/* need this to position inner content */
    overflow-y: auto;
  }

  .app-footer {
    flex: 0 0 auto;
    background-color: #dcdcdc;
  }

 /* Sidenav */
  .lokkit-logo {
    width:100%;
    font-size: 24px;
    vertical-align: center;
    text-align: center;
    border-bottom: 1px solid rgba(0,0,0,.12);
    min-height: 9em;
  }
  .lokkit-logo img,
  .lokkit-logo span {
    width: 7em;
    margin: 0 auto;
    display: block;
  }
</style>
