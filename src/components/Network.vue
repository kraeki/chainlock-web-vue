<template>
  <div>
    <md-card>
      <md-card-area md-inset>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Node information</div>
            <div class="md-subhead">
              <span>
                <md-icon v-bind:class="[nodeInformation.connected ? 'md-accent' : 'md-warn']">language</md-icon>
                {{nodeInformation.url}}
                <md-tooltip md-direction="bottom">
                  <span v-if="nodeInformation.connected">Successfully connected</span>
                  <span v-else>Connection failed</span>
                </md-tooltip>
              </span>
            </div>
          </md-card-header-text>
          <md-card-media>
            <md-icon class="md-size-3x">language</md-icon>
          </md-card-media>
        </md-card-header>

        <md-card-content>
          <div class="card-reservation">
            <md-icon>cloud_done</md-icon>
            Connected:
            {{nodeInformation.connected}}
          </div>
          <div class="card-reservation">
            <md-icon>label_outline</md-icon>
            Version:
            {{nodeInformation.version}}
          </div>
          <div class="card-reservation">
            <md-icon>widgets</md-icon>
            {{nodeInformation.blockNumber}}
          </div>
        </md-card-content>
        <md-card-actions>
	  <md-button @click.native="openDialog('changeNetworkDialog')" class="md-raised md-accent">Change Network</md-button>
        </md-card-actions>
      </md-card-area>
    </md-card>

    <!-- Accounts list -->
    <md-card style="margin-top:1em; margin-bottom:1em">
      <md-card-area md-inset>
        <md-card-content>
          <h3 class="md-subheading" style="display:flex;">Accounts</h3>
          <accounts/>
        </md-card-content>
      </md-card-area>
    </md-card>

    <md-dialog ref="changeNetworkDialog">
      <md-dialog-title>Change Network</md-dialog-title>
      <md-progress v-show="waiting" class="md-accent" md-indeterminate></md-progress>

      <md-dialog-content>
        <form v-on:submit.prevent="connectToNode">
          <md-input-container>
            <md-icon class="md-accent">language</md-icon>
            <label>Node url</label>
            <md-input placeholder="http://localhost:8545" v-model="changeNetworkDialog.url" type="text" :disabled="waiting"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog('changeNetworkDialog')">Cancel</md-button>
        <md-button :disabled="waiting" class="md-raised md-accent" @click.native="connectToNode">
          Connect
          <md-progress v-show="waiting" class="md-accent" md-indeterminate></md-progress>
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Accounts from './Accounts.vue'

  export default {
    name: 'Network',
    components: {Accounts},
    methods: {
      openDialog: function (dialog) {
        this.$refs[dialog].open()
      },
      closeDialog: function (dialog) {
        this.$refs[dialog].close()
      },
      connectToNode: function () {
        if (!this.changeNetworkDialog.url) {
          this.$toasted.error('Please specify url')
          return
        }
        this.$store.dispatch('connectToNode', {
          url: this.changeNetworkDialog.url
        }).then(result => {
          this.$toasted.success(result)
          this.closeDialog('changeNetworkDialog')
        }).catch(err => {
          this.$toasted.error(err)
        })
      }
    },
    mounted () {
      // prefill
      this.changeNetworkDialog.url = this.nodeInformation.url
    },
    data: function () {
      return {
        waiting: false,
        changeNetworkDialog: {
          url: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'nodeInformation'
      ])
    }
  }
</script>

<style scoped>
  .card-reservation {
    margin-top: 8px;

    .md-icon {
      margin: 28px;
      color: rgba(#000, .54) !important;
    }

    .md-button {
      border-radius: 2px !important;
    }
  }
</style>
