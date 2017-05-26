<template>
  <div id="app">
    <md-toolbar>
      <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
	<md-icon>menu</md-icon>
      </md-button>
      <h1 class="md-title">My Title</h1>
    </md-toolbar>

    <div class="main-content">
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
                <md-icon>account_box</i></md-icon>
                <span>Account</span>
              </a>
            </li>
          </ul>
        </div>
      </md-sidenav>
      <!-- End Menu items -->

    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {},
    methods: {
      toggleLeftSidenav: function () {
        this.$refs.leftSidenav.toggle()
      }
    }

  }
</script>

<style>
  body {
    margin: 0px;
    padding: 0px;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 0px;
    padding: 0px;
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
