<template>
  <div class="baseSetting">
    <el-tabs v-model="activeName">
      <el-form ref="formRef" :model="formInline" :rules="rules" label-width="130px">
        <el-tab-pane label="注册与访问" name="registrationAndAccess">
          <el-form-item prop="open_reg" label="是否允许注册会员">
            <el-radio-group v-model="formInline.open_reg">
              <el-radio :label="1" border>是</el-radio>
              <el-radio :label="0" border>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="reg_method" label="注册类型">
            <el-radio-group v-model="formInline.reg_method">
              <el-radio label="username" border>普通注册</el-radio>
              <el-radio label="phone" border>手机注册</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="password_min" label="密码最小长度">
            <el-input-number v-model="formInline.password_min" :controls="false" :min="0" :precision="0"
                             placeholder="请输入" style="width: 220px"/>
          </el-form-item>
          <el-form-item prop="password_encrypt" label="强制密码复杂度">
            <el-check-tag style="margin-right: 10px" :checked="formInline.passwordEncrypt.includes('0')"
                          @change="value => onChange(value, '0')">数字
            </el-check-tag>
            <el-check-tag style="margin-right: 10px" :checked="formInline.passwordEncrypt.includes('1')"
                          @change="value => onChange(value, '1')">小写字母
            </el-check-tag>
            <el-check-tag style="margin-right: 10px" :checked="formInline.passwordEncrypt.includes('2')"
                          @change="value => onChange(value, '2')">
              大写字母
            </el-check-tag>
            <el-check-tag :checked="formInline.passwordEncrypt.includes('3')" @change="value => onChange(value, '3')">
              符号
            </el-check-tag>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="上传设置" name="updateSetting">
          <el-form-item prop="upload_method" label="默认上传方式">
            <el-radio-group v-model="formInline.upload_method">
              <el-radio label="oss" border>阿里oss</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="bucket" label="Bucket">
            <el-input v-model="formInline.upload_config.bucket" placeholder="请输入" style="width: 220px" clearable/>
          </el-form-item>
          <el-form-item prop="ACCESS_KEY" label="ACCESS_KEY">
            <el-input v-model="formInline.upload_config.ACCESS_KEY" type="password" placeholder="请输入"
                      style="width: 220px" clearable/>
          </el-form-item>
          <el-form-item prop="SECRET_KEY" label="SECRET_KEY">
            <el-input v-model="formInline.upload_config.SECRET_KEY" type="password" placeholder="请输入"
                      style="width: 220px" clearable/>
          </el-form-item>
          <el-form-item prop="http" label="空间域名">
            <el-input v-model="formInline.upload_config.http" placeholder="请输入" style="width: 220px" clearable/>
            <el-popover
                placement="right"
                title="提示"
                :width="300"
                trigger="hover"
                content="请补全http://或https://"
            >
              <template #reference>
                <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer">
                  <QuestionFilled/>
                </el-icon>
              </template>
            </el-popover>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="API安全" name="APISecurity">
          <el-form-item prop="api_safe" label="是否开启API安全">
            <el-radio-group v-model="formInline.api_safe">
              <el-radio :label="1" border>是</el-radio>
              <el-radio :label="0" border>否</el-radio>
            </el-radio-group>
            <el-popover
                placement="right"
                title="提示"
                :width="300"
                trigger="hover"
                content="API安全功能开启后调用前端API需要传输签名串"
            >
              <template #reference>
                <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer">
                  <QuestionFilled/>
                </el-icon>
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item prop="api_secret" label="秘钥">
            <el-input v-model="formInline.api_secret" placeholder="请输入" style="width: 220px" clearable/>
            <el-popover
                placement="right"
                title="提示"
                :width="300"
                trigger="hover"
                content="秘钥设置关系系统中API调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token"
            >
              <template #reference>
                <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer">
                  <QuestionFilled/>
                </el-icon>
              </template>
            </el-popover>
          </el-form-item>
        </el-tab-pane>
      </el-form>
    </el-tabs>

    <el-button :loading="loading" type="primary" style="margin-left: 200px" @click="submit">保存</el-button>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {getBaseSetting, setBaseSetting} from '@/request/api/systemSettings.js'
import {ElMessage} from "element-plus";

const activeName = ref('registrationAndAccess')
const formRef = ref()
const loading = ref(false)
const formInline = reactive({
  passwordEncrypt: [],

  open_reg: 1, //是否允许注册会员
  reg_method: 'username', //注册类型
  password_min: 0, //密码长度
  password_encrypt: '', //密码复杂度0数字，1小写，2大写，3符号

  upload_method: 'oss', //上传方式
  upload_config: {
    bucket: '', //bucket
    ACCESS_KEY: '', //ACCESS_KEY
    SECRET_KEY: '', //SECRET_KEY
    http: '', //空间域名
  },

  api_safe: 1, //api安全
  api_secret: '' //秘钥
})
const rules = reactive({
  password_min: [{required: true, message: '请输入必填项', trigger: 'blur'}],
  password_encrypt: [{required: true, message: '请选择必填项', trigger: 'blur'}]
})

const getInfo = async () => {
  let res = await getBaseSetting()
  if (res.code !== 200) {
    return ElMessage.error(res.msg + '!')
  }
  formInline.open_reg = res.data.open_reg
  formInline.reg_method = res.data.reg_method
  formInline.password_min = res.data.password_min
  formInline.passwordEncrypt = res.data.password_encrypt.split(',') //split,splice,slice

  formInline.upload_method = res.data.upload_method
  formInline.upload_config = res.data.upload_config

  formInline.api_safe = res.data.api_safe
  formInline.api_secret = res.data.api_secret
}

watch(
    () => formInline.passwordEncrypt,
    v => {
      formInline.password_encrypt = v.toString()
      console.log(formInline.password_encrypt)
    },
    {
      deep: true
    }
)

onMounted(() => {
  getInfo()
})

//改变强制密码复杂度
const onChange = (value, type) => {
  if (value) {
    formInline.passwordEncrypt.push(type)
  } else {
    formInline.passwordEncrypt = formInline.passwordEncrypt.filter(item => {
      return item !== type
    })
  }
  formInline.passwordEncrypt.sort()
}

const submit = () => {
  formRef.value.validate(async isValid => {
    if (!isValid) {
      return ElMessage.error('请输入必填项！')
    }
    loading.value = true
    let res = await setBaseSetting(formInline)
    if (res.code !== 200) {
      ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
      await getInfo()
      loading.value = false
      return
    }
    loading.value = false
    ElMessage.success('修改成功~')
  })
}

</script>

<style scoped lang="less">
.baseSetting {
  padding: 20px;
}
</style>