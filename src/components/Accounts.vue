<template>
  <div>
    <md-list class="md-double-line">
      <md-list-item v-for="account in accounts" :key="account">
        <md-avatar class="md-avatar-icon md-accent">
          <md-icon>account_circle</md-icon>
        </md-avatar>
        <div class="md-list-text-container">
          <span>{{account.address}}</span>
          <p>
            <md-icon md-iconset="mdi mdi-qrcode" />{{account.address}}
          </p>
        </div>
        <md-button @click.native="openPassphraseDialog(account.address)" :value="account.address" class="md-icon-button md-list-action">
          <md-icon v-if="account.default" class="md-accent">lock_open</md-icon>
          <md-icon v-else>locked</md-icon>
        </md-button>
        <md-divider class="md-inset"></md-divider>
      </md-list-item>
    </md-list>

    <md-dialog ref="passphraseDialog">
      <md-dialog-title>Passphrase required</md-dialog-title>

      <md-dialog-content>
        <form novalidate @submit.stop.prevent="closePassphraseDialog">
          <md-input-container md-has-password>
            <label>Enter passphrase...</label>
            <md-input v-model="passphraseDialog.passphrase" type="password"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closePassphraseDialog(false)">Cancel</md-button>
        <md-button class="md-primary" @click.native="closePassphraseDialog(true)">Unlock</md-button>
      </md-dialog-actions>
    </md-dialog>

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
  methods: {
    openPassphraseDialog (accountAddress) {
      this.passphraseDialog.accountAddress = accountAddress
      this.passphraseDialog.passphrase = ''
      this.$refs.passphraseDialog.open()
    },
    closePassphraseDialog (ret) {
      if (!ret) {
        this.$refs.passphraseDialog.close()
        return
      }
      this.$store.dispatch('switchAccount', this.passphraseDialog).then((msg) => {
        this.$toasted.success(msg)
        this.$refs.passphraseDialog.close()
      }).catch((err) => {
        this.$toasted.error(err)
      })
    }
  },
  data () {
    return {
      passphraseDialog: {
        accountAddress: null,
        passphrase: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
