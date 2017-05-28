<template>
  <div id="app">
    <md-toolbar>
      <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
	<md-icon>menu</md-icon>
      </md-button>
      <h1 class="md-title">{{ $route.meta.title }}</h1>
    </md-toolbar>

    <md-content>
      <router-view></router-view>
      <!-- Menu items -->
      <md-sidenav class="md-left" ref="leftSidenav">
        <md-toolbar>
          <div class="lokkit-logo">
            <img src="static/lokkit_icon_400.png" alt="lokkit logo"/>
            <span>Lokkit Menu</span>
          </div>
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
              <a href="#/account"
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
    </md-content>
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
        href="#/account"
        md-iconset="mdi mdi-account-box"
        v-bind:class="{'md-active': $route.name == 'account'}">
        My account
      </md-bottom-bar-item>
    </md-bottom-bar>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {},
    methods: {
      toggleLeftSidenav: function () {
        this.$refs.leftSidenav.toggle()
      },
      resetLocalStorage: function () {
        localStorage.clear()
        location.reload()
      }
    }

  }
</script>

<style>

  body {
    margin: 0px;
    padding: 0px;
    min-height: 100%;

    display: flex;
    flex-direction: column;
  }

  #app {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  md-content {
    flex: 1;
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
  .lokkit-logo img {
    width: 7em;
    margin: 0 auto;
    display: block;
  }
</style>
