<template>
  <el-row class="min-h-screen bg-indigo-500">
    <!--    宽度≥1200px 16:8, 宽度≥992px 12:12 宽度<992px 上下布局-->
    <el-col :lg="16" :md="12" class="flex items-center justify-center">
      <div>
        <div class="font-bold text-5xl text-light-50 mb-4">欢迎回来</div>
        <div class="text-light-50 ">这是一个vue3 + vite + Element Plus + Windi Css开发的后台管理项目</div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="bg-light-50 flex items-center justify-center flex-col">
      <div class="text-2xl font-bold text-gray-800">请登录</div>
      <div class="mt-3 mb-3 text-gray-300">——— 账号密码登录 ———</div>
      <el-form ref="formRef" :model="formInline" :rules="formInline.rules" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model.trim="formInline.username" placeholder="请输入用户名" :prefix-icon="User" clearable/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model.trim="formInline.password" placeholder="请输入密码" :prefix-icon="Lock"
                    clearable/>
        </el-form-item>
        <el-button class="w-[250px]" color="#6366f1" round type="primary" @click="onSubmit">登录</el-button>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {User, Lock} from '@element-plus/icons-vue'
import {login, getUserInfo} from "@/request/api/manager";
import {useRouter} from "vue-router";
import {useStore} from 'vuex'

const formRef = ref()
const router = useRouter()
const store = useStore()
const formInline = reactive({
  username: 'admin',
  password: 'admin',
  rules: {
    username: {required: true, message: '请输入用户名', trigger: 'blur'},
    password: {required: true, message: '请输入密码', trigger: 'blur'}
  }
})

const onSubmit = () => {
  formRef.value.validate(async (isValid) => {
    if (!isValid) return
    //登录
    let loginRes = await login({username: formInline.username, password: formInline.password})
    if (loginRes.code !== 200) {
      return ElMessage.error(loginRes.msg + '!')
    }
    //保存token到vuex
    store.dispatch('manager/tokenAction', loginRes.data.token)

    // 获取用户信息并保存到vuex
    let getUserInfoRes = await getUserInfo()
    if (getUserInfoRes.code !== 200) {
      return ElMessage.error(getUserInfoRes.msg + '!')
    }
    //保存用户信息
    store.dispatch('manager/userInfoAction', getUserInfoRes.data)

    ElMessage.success('登陆成功~')
    // 跳转路由到首页
    router.replace('/')
  })
}
</script>

<style scoped>

</style>