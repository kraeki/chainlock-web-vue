<template>
  <div>
    <el-button
      @click="dialogFormVisible = true"
      type="primary"
      size="small">
    Rent ({{contractAddress}})
    </el-button>
    <el-dialog title="Rent" v-model="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="start time">
          <el-input v-model="form.start" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="end time">
          <el-input v-model="form.end" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">Cancel</el-button>
        <el-button type="primary" @click="confirm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'RentButton',
    props: {
      contractAddress: {
        type: String
      }
    },
    methods: {
      cancel: function () {
        this.dialogFormVisible = false
        // this.$emit('close', 'cancel')
      },
      confirm: function () {
        this.dialogFormVisible = false
        // this.$emit('close', 'success')
        var data = {contractAddress: this.contractAddress, start: this.form.start, end: this.form.end}
        this.$emit('rent', data)
      }
    },
    data () {
      return {
        dialogFormVisible: false,
        formLabelWidth: '',
        form: {
          start: Math.floor(new Date().getTime() / 1000),
          end: Math.floor(new Date().getTime() / 1000)
        }
      }
    }
  }
</script>
