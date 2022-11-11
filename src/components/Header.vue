<template>
  <div class="f-header">
    <span class="logo">
      <el-tooltip effect="dark" content="西兰花🥦" placement="bottom-end">
        <el-icon class="icon-btn"><Promotion/></el-icon>
      </el-tooltip>
      西兰花🥦
    </span>
    <el-tooltip effect="dark" content="折叠" placement="bottom-end">
      <el-icon class="icon-btn" @click="$store.commit('changeFold')">
        <Fold v-if="!$store.state.isFoldMenu"/>
        <Expand v-else/>
      </el-icon>
    </el-tooltip>

    <div class="ml-auto flex items-center">
      <el-tooltip effect="dark" content="刷新" placement="bottom-end">
        <el-icon class="icon-btn" @click="refresh">
          <Refresh/>
        </el-icon>
      </el-tooltip>
      <el-tooltip effect="dark" :content="!isFullscreen?'全屏':'退出全屏'" placement="bottom-end">
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-if="!isFullscreen"/>
          <Aim v-else/>
        </el-icon>
      </el-tooltip>
      <el-dropdown class="dropdown">
        <span class="el-dropdown-link flex items-center">
          <el-avatar class="mr-2" :size="30" :src="$store.state.manager.avatar"/>
          {{ $store.state.manager.username }}
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="drawer = true">修改密码</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!--    修改密码抽屉-->
    <FormDrawer v-model="drawer" title="修改密码" @handleClose="handleClose" @onSubmit="onSubmit" :loading="loading">
      <el-form ref="formRef" :model="formInline" :rules="rules" label-width="100px">
        <el-form-item label="旧密码：" prop="oldpassword">
          <el-input type="password" v-model.trim="formInline.oldpassword" placeholder="请输入旧密码" clearable/>
        </el-form-item>
        <el-form-item label="新密码：" prop="password">
          <el-input type="password" v-model.trim="formInline.password" placeholder="请输入新密码" clearable/>
        </el-form-item>
        <el-form-item label="确认密码：" prop="repassword">
          <el-input type="password" v-model.trim="formInline.repassword" placeholder="请输入确认密码" clearable/>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useStore} from "vuex"
import {useRouter} from "vue-router"
import {ElMessage} from "element-plus";
import {messageBox} from '@/utils/message'
import {loginOut, changePassword} from "@/request/api/manager";
import {useFullscreen} from '@vueuse/core'
import FormDrawer from '@/components/FormDrawer.vue'

const store = useStore()
const router = useRouter()
const {isFullscreen, toggle} = useFullscreen()
const drawer = ref(false)
const formRef = ref()
const loading = ref(false)
//修改密码字段
const formInline = reactive({
  oldpassword: '',
  password: '',
  repassword: '',
})
const rules = {
  oldpassword: {required: true, message: '请输入旧密码', trigger: 'blur'},
  password: {required: true, message: '请输入新密码', trigger: 'blur'},
  repassword: {required: true, validator: () => simplePassword(), trigger: 'blur'}
}
//确认密码是否相同校验
const simplePassword = () => {
  return new Promise((resolve, reject) => {
    if (!formInline.repassword) {
      reject('请再次输入密码！')
    } else if (formInline.repassword !== formInline.password) {
      reject('两次密码不一致！')
    } else {
      resolve()
    }
  })
}

//刷新
const refresh = () => location.reload()

//关闭修改密码
const handleClose = () => {
  formInline.oldpassword = ''
  formInline.password = ''
  formInline.repassword = ''
  formRef.value.clearValidate()
}

//修改密码
const onSubmit = () => {
  loading.value = true
  formRef.value.validate(async (isValid) => {
    if (!isValid) {
      return
    }
    //修改密码请求
    let res = await changePassword(formInline)
    loading.value = false
    if (res.code !== 200) {
      return ElMessage.error(res.msg + '!')
    }
    ElMessage.success('修改密码成功，请重新登录!')
    store.dispatch('manager/loginOutAction')
    router.replace('/login')
  })
}

//退出登录
const logout = async () => {
  let res = await messageBox('确认退出登录?')
  if (!res) return
  let loginOutRes = await loginOut()
  if (loginOutRes.code !== 200) {
    return ElMessage.error(loginOutRes.msg)
  }
  ElMessage.success(loginOutRes.data)
  store.dispatch('manager/loginOutAction')
  router.replace('/login')
}
</script>

<style scoped>
.f-header {
  background-color: #43474f;
  @apply fixed top-0 left-0 right-0 z-60 text-light-50 flex items-center shadow;
  height: 64px;
}

.logo {
  width: 250px;
  @apply flex justify-center items-center font-sans text-xl font-thin text-indigo-100;
}

.f-header .icon-btn {
  @apply flex justify-center items-center;
  height: 64px;
  width: 42px;
  cursor: pointer;
}

.f-header .icon-btn:hover {
  background-color: #545c64;
}

.f-header .dropdown {
  height: 64px;
  @apply flex justify-center items-center text-indigo-50 mx-5;
  cursor: pointer;
}
</style>