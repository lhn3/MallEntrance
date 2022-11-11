<template>
  <el-dialog v-model="props.modelValue" title="订单详情" custom-class="custom-dialog" draggable
             @close="cancel">
    <el-form ref="formRef" :model="state.formInline" :rules="state.rules" label-width="120px">
    <div v-if="state.type === 'alipay'">
      <el-form-item prop="app_id" label="app_id">
        <el-input v-model="state.formInline.app_id" placeholder="请输入" style="width: 220px" clearable/>
      </el-form-item>
      <el-form-item prop="ali_public_key" label="ali_public_key">
        <el-input type="textarea" rows="4" v-model="state.formInline.ali_public_key" placeholder="请输入" style="width: 60%"/>
      </el-form-item>
      <el-form-item prop="private_key" label="private_key">
        <el-input type="textarea" rows="4" v-model="state.formInline.private_key" placeholder="请输入" style="width: 60%"/>
      </el-form-item>
    </div>

    <div v-else-if="state.type === 'wxpay'">
      <el-form-item prop="app_id" label="公众号APPID">
        <el-input v-model="state.formInline.app_id" placeholder="请输入" style="width: 220px" clearable/>
      </el-form-item>
      <el-form-item prop="app_id" label="小程序APPID">
        <el-input v-model="state.formInline.miniapp_id" placeholder="请输入" style="width: 220px" clearable/>
      </el-form-item>
      <el-form-item prop="secret" label="小程序secret">
        <el-input v-model="state.formInline.secret" placeholder="请输入" style="width: 220px" clearable/>
      </el-form-item>
      <el-form-item prop="appid" label="appid">
        <el-input v-model="state.formInline.appid" placeholder="请输入" style="width: 220px" clearable/>
      </el-form-item>
      <el-form-item prop="mch_id" label="商户号">
        <el-input v-model="state.formInline.mch_id" placeholder="请输入" style="width: 220px" clearable/>
      </el-form-item>
      <el-form-item prop="key" label="API秘钥">
        <el-input v-model="state.formInline.key" placeholder="请输入" style="width: 220px" clearable/>
      </el-form-item>
      <el-form-item prop="cert_client" label="cert_client">
        <el-upload
            action="api/admin/sysconfig/upload"
            :limit="1"
            accept=".pem"
            :headers="{token: $store.state.manager.token}"
            :on-success="cert_client_uploadSuccess"
        >
          <el-button type="primary">上传文件</el-button>
        </el-upload>
        <div style="color: #e03e2d;margin-left: 10px">{{ state.formInline.cert_client || '暂未配置' }}</div>
      </el-form-item>
      <el-form-item prop="cert_key" label="cert_key">
        <el-upload
            action="api/admin/sysconfig/upload"
            :limit="1"
            accept=".pem"
            :headers="{token: $store.state.manager.token}"
            :on-success="cert_key_uploadSuccess"
        >
          <el-button type="primary">上传文件</el-button>
        </el-upload>
        <div style="color: #e03e2d;margin-left: 10px">{{ state.formInline.cert_key || '暂未配置' }}</div>
      </el-form-item>
    </div>
    </el-form>
    <template #footer>
      <el-button @click="cancel">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, nextTick, reactive, ref, watch} from 'vue'
// import {ElMessage} from "element-plus";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  detail: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue'])
const formRef = ref()
//表格数据
const state = reactive({
  loading: false,
  type: '',
  formInline: {},
  rules: {
    app_id: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    ali_public_key: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    private_key: [{required: true, message: '请输入必填项', trigger: 'blur'}],

    miniapp_id: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    secret: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    appid: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    mch_id: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    key: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    cert_client: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    cert_key: [{required: true, message: '请输入必填项', trigger: 'blur'}],
  }
})

watch(
    () => props.modelValue,
    v => {
      if (v) {
        nextTick(()=>{
          state.type = props.detail.type
          state.formInline = JSON.parse(JSON.stringify(props.detail[state.type]))
          console.log(state.formInline)
        })
      } else {
        formRef.value.clearValidate()
        state.type = ''
        state.formInline = {}
      }
    }
)

//上传文件成功回调
const cert_client_uploadSuccess = response => {
  state.formInline.cert_client = response.data
}

const cert_key_uploadSuccess = response => {
  state.formInline.cert_key = response.data
}


//取消
const cancel = () => {
  emit('update:modelValue')
}

</script>

<style scoped lang="less">

</style>