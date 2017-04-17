<template>
  <div>
    <el-button
      @click="dialogFormVisible = true"
      type="primary"
      size="small">
    Rent ({{contractAddress}})
    </el-button>
    <el-dialog title="Shipping address" v-model="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Promotion name" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Zones" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai"></el-option>
            <el-option label="Zone No.2" value="beijing"></el-option>
          </el-select>
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
        this.$emit('close', 'cancel')
      },
      confirm: function () {
        this.dialogFormVisible = false
        this.$emit('close', 'success')
      }
    },
    data () {
      return { }
    }
  }
</script>
