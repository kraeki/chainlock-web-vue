<template>
  <div id="app">
    <div class="app-header">
    <md-toolbar class="md-accent">
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
          <md-list class="md-double-line" style="margin-top:1em">
            <md-list-item v-if="activeAccount == null">
              <md-icon class="md-warn md-size-2x">error</md-icon>
              <div>
                <span>Error, no account logged in</span>
              </div>
              <md-button @click.native="toggleAccountsList" class="md-icon-button md-list-action">
                <md-icon v-if="showAccountsList">arrow_drop_up</md-icon>
                <md-icon v-else>arrow_drop_down</md-icon>
              </md-button>
            </md-list-item>
            <md-list-item v-else>
              <md-icon class="md-accent md-size-2x">account_circle</md-icon>
              <div class="md-list-text-container">
                <lk-address :address="activeAccount.address" />
                <span>Ξ {{activeAccount.balance}}</span>
              </div>
              <md-button @click.native="toggleAccountsList" class="md-icon-button md-list-action">
                <md-icon v-if="showAccountsList">arrow_drop_up</md-icon>
                <md-icon v-else>arrow_drop_down</md-icon>
              </md-button>
            </md-list-item>
          </md-list>
        </md-toolbar>
        <accounts v-if="showAccountsList"/>
        <md-list>
          <md-list-item @click.native="goto('Scanner')">
            <md-icon><i class="mdi mdi-qrcode-scan"></i></md-icon>
            <span>Scan</span>
          </md-list-item>
          <md-list-item @click.native="goto('Rentables')">
            <md-icon><i class="mdi mdi-book-multiple-variant"></i></md-icon>
            <span>My lockers</span>
          </md-list-item>
          <md-divider class="md-inset"></md-divider>
          <md-subheader>Settings</md-subheader>
          <md-list-item @click.native="goto('Network')">
            <md-icon>language</md-icon>
            <span>Change Network</span>
          </md-list-item>
          <md-list-item @click.native="resetLocalStorage">
            <md-icon>reset</md-icon>
            <span>Reset Storage</span>
          </md-list-item>
        </md-list>
      </md-sidenav>
      <!-- End Menu items -->
    </div>

    <div class="app-footer">
      <md-whiteframe md-elevation="15">
        <md-bottom-bar class="md-accent">
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
  import Accounts from './components/Accounts.vue'
  import lkAddress from './components/Address.vue'

  export default {
    name: 'app',
    components: {Login, Accounts, lkAddress},
    methods: {
      toggleLeftSidenav: function () {
        this.$refs.leftSidenav.toggle()
      },
      goto: function (routeName) {
        this.$refs.leftSidenav.close()
        this.$router.push({name: routeName})
      },
      toggleAccountsList: function () {
        this.showAccountsList = !this.showAccountsList
      },
      resetLocalStorage: function () {
        localStorage.clear()
        location.reload()
      }
    },
    computed: mapGetters(['activeAccount']),
    data: function () {
      return {
        showAccountsList: false
      }
    },
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
    vertical-align: center;
    text-align: center;
    border-bottom: 1px solid rgba(0,0,0,.12);
    min-height: 9em;
  }
  .lokkit-logo img {
    width: 60%;
    margin: 0 auto;
    display: block;
  }
</style>
