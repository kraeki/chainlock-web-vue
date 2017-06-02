<template>
  <md-dialog ref="passphraseDialog">
    <md-dialog-title>Login an account</md-dialog-title>

    <md-dialog-content>
      <form novalidate @submit.stop.prevent="closePassphraseDialog">

        <md-menu md-size="7" md-direction="bottom left" :md-close-on-select="true">

          <md-whiteframe>
          <md-list class="md-double-line">
            <md-list-item>
              <md-avatar class="md-avatar-icon">
                <md-icon>account_circle</md-icon>
              </md-avatar>
              <div v-if="!passphraseDialog.accountAddress" class="md-list-text-container">
                <span>0xc00d0f0asd0f0asd0f0asdf0as0df0</span>
                <p>
                <md-icon>attach_money</md-icon>59345848449
                </p>
              </div>
              <div v-else class="md-list-text-container">
                <span>{{passphraseDialog.accountAddress}}</span>
              </div>
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon>expand_more</md-icon>
              </md-button>
            </md-list-item>
          </md-list>
          </md-whiteframe>

          <md-menu-content>
            <md-menu-item @click.native="setAccount(account.address)" v-for="account in getAccounts" :key="account.address">
              <md-icon>account_circle</md-icon>
              <span>{{account.address}}</span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>

        <md-input-container md-theme="green" md-has-password>
          <label>Account's passphrase</label>
          <md-input v-model="passphraseDialog.passphrase" type="password"></md-input>
        </md-input-container>
      </form>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click.native="closePassphraseDialog(false)">Cancel</md-button>
      <md-button class="md-primary" @click.native="closePassphraseDialog(true)">Unlock</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'Login',
    components: {},
    computed: mapGetters(['activeAccount', 'getAccounts']),
    mounted () {
      console.log(typeof (this))
      if (!this.activeAccount) {
        // this.passphraseDialog.accountAddress = accountAddress
        this.passphraseDialog.passphrase = ''
        this.$nextTick(() => {
          this.$refs.passphraseDialog.open()
        })
      }
    },
    methods: {
      setAccount (accountAddress) {
        this.passphraseDialog.accountAddress = accountAddress
      },
      closePassphraseDialog (result) {
        if (!result) {
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

<style>
</style>
