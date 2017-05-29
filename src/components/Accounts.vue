<template>
  <div>
    <md-list class="md-double-line">
      <md-list-item v-for="account in accounts" :key="account">
        <md-avatar class="md-avatar-icon">
          <md-icon>account_circle</md-icon>
        </md-avatar>
        <div class="md-list-text-container">
          <span>{{account}}</span>
          <p>
            <md-icon md-iconset="mdi mdi-qrcode" />{{account}}
          </p>
        </div>
        <md-button :href="'#/rentable/' + rentable" class="md-icon-button md-list-action">
          <md-icon>info</md-icon>
        </md-button>
        <md-divider class="md-inset"></md-divider>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'

export default {

  name: 'Accounts',
  props: {},
  components: {},
  computed: mapGetters({
    accounts: 'getAccounts'
  }),
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
