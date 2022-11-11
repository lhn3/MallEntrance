<template>
  <div class="user">
    <Search v-model="tableHeight" @reset="_table.reset" @search="_table.search" @refresh="_table.getDataList">
      <template #search>
        <el-form-item label="关键词：">
          <el-input placeholder="手机号/邮箱/用户昵称" v-model="state.dataForm.keyword" clearable
                    style="width: 215px;"/>
        </el-form-item>
        <el-form-item label="会员等级：">
          <el-select v-model="state.dataForm.user_level_id" placeholder="请选择" clearable>
            <el-option
                v-for="item in state.level"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </template>

      <template #button>
        <el-button type="primary" @click="openDrawer">新增</el-button>
      </template>

      <template #table>
        <el-table :height="tableHeight" :data="_table.tableInfo.dataList" border style="width: 100%">
          <el-table-column label="会员" header-align="center" min-width="200">
            <template #default="{ row }">
              <div style="display: flex;padding: 5px">
                <el-image :src="row.avatar" fit="cover" style="width: 50px;height: 50px;border-radius: 25px"/>
                <div style="padding-left: 20px">
                  <div style="line-height: 25px">{{ row.username }}</div>
                  <div style="line-height: 25px">ID：{{ row.id }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="会员等级" header-align="center" align="center" min-width="100px">
            <template #default="{ row }">
              {{ row.user_level?.name }}
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="注册时间" header-align="center" align="center" min-width="170"/>
          <el-table-column prop="email" label="邮箱" header-align="center" align="center" min-width="180"/>
          <el-table-column prop="phone" label="手机号" header-align="center" align="center" min-width="120"/>
          <el-table-column prop="status" label="状态" header-align="center" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                         @change="(value) => _table.changeStatus(value, row.id)" :disabled="row.super === 1"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120px" header-align="center" align="center">
            <template #default="{ row }">
              <el-button type="text" @click="editDrawer(row)" :disabled="row.super === 1">修改</el-button>
              <el-button type="text" style="color: #f46c6c" @click="_table.deleteHandle(row.id)"
                         :disabled="row.super === 1">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template #pagination>
        <el-pagination background
                       :current-page="_table.tableInfo.page"
                       :page-size="_table.tableInfo.limit"
                       :total="_table.tableInfo.total"
                       layout="prev, pager, next"
                       @current-change="_table.pageCurrentChangeHandle"/>
      </template>
    </Search>

  </div>

  <!--  抽屉-->
  <FormDrawer v-model="state.drawer" :title="state.title" :loading="_table.tableInfo.loading"
              @handleClose="drawerClose" @onSubmit="drawerSubmit">
    <el-form ref="formRef" :model="state.formData" :rules="state.rules" label-width="120px">
      <el-form-item prop="username" label="用户名：">
        <el-input v-model.trim="state.formData.username" placeholder="请输入" clearable style="width: 220px;"/>
      </el-form-item>
      <el-form-item prop="password" label="密码：">
        <el-input type="password" placeholder="请输入" v-model="state.formData.password" maxlength="18" clearable style="width: 220px;"/>
      </el-form-item>
      <el-form-item prop="avatar" label="头像：">
        <ImageSelect v-model="state.formData.avatar"/>
      </el-form-item>
      <el-form-item prop="nickname" label="昵称：">
        <el-input v-model.trim="state.formData.nickname" placeholder="请输入" clearable style="width: 220px;"/>
      </el-form-item>
      <el-form-item prop="phone" label="手机号：">
        <el-input v-model="state.formData.phone" placeholder="请输入" clearable style="width: 220px;"/>
      </el-form-item>
      <el-form-item prop="email" label="邮箱：">
        <el-input v-model.trim="state.formData.email" placeholder="请输入" clearable style="width: 220px;"/>
      </el-form-item>
      <el-form-item prop="user_level_id" label="会员等级：">
        <el-select v-model="state.formData.user_level_id" placeholder="请选择" clearable style="width: 220px;">
          <el-option
              v-for="item in state.level"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="状态：">
        <el-switch v-model="state.formData.status" :active-value="1" :inactive-value="0"/>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import Search from '@/components/Search.vue'
import ImageSelect from '@/components/ImageSelect.vue'
import {onMounted, reactive, ref} from "vue";
import TableView from "@/utils/useView.js";

const formRef = ref()
const tableHeight = ref()
const state = reactive({
  url: '/admin/user',
  deleteUrl: '/admin/user',
  addUrl: '/admin/user',
  updateUrl: '/admin/user',
  level: [],
  title: '', //抽屉标题
  id: null, //修改的数据id
  drawer: false,  //抽屉显示隐藏
  dataForm: { //搜索数据
    keyword: '',
    user_level_id: ''
  },
  formData: { //新增修改数据
    username: '',
    password: '',
    avatar: [],
    nickname: '',
    phone: '',
    email: '',
    user_level_id: null,
    status: 1
  },
  rules: {
    username: {required: true, message: '请输入必填项', trigger: 'blur'},
    password: {required: true, message: '请输入必填项', trigger: 'blur'},
    nickname: {required: true, message: '请输入必填项', trigger: 'blur'},
    phone: {required: true, message: '请输入必填项', trigger: 'blur'},
    email: {required: true, message: '请输入必填项', trigger: 'blur'},
    user_level_id: {required: true, message: '请选择必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList().then(res => {
    state.level = res.data.user_level
  })
})

//新增
const openDrawer = () => {
  state.title = '新增公告'
  state.drawer = true
}

//修改
const editDrawer = (row) => {
  state.title = '修改公告'
  state.id = row.id
  state.formData.username = row.username
  state.formData.password = row.password
  state.formData.avatar = [row.avatar]
  state.formData.nickname = row.nickname
  state.formData.phone = row.phone
  state.formData.email = row.email
  state.formData.user_level_id = row.user_level_id
  state.formData.status = row.status
  state.drawer = true
}

//关闭右侧抽屉
const drawerClose = () => {
  formRef.value.resetFields()
  state.title = ''
  state.id = null
  state.formData.username = ''
  state.formData.password = ''
  state.formData.avatar = []
  state.formData.nickname = ''
  state.formData.phone = ''
  state.formData.email = ''
  state.formData.user_level_id = null
  state.formData.status = 1
  state.drawer = false
}

//提交
const drawerSubmit = () => {
  _table.addOrUpdate(formRef.value, {...state.formData, avatar: state.formData.avatar[0]}, state.id).then(res => {
    if (res) drawerClose()
  })
}
</script>

<style scoped lang="less">
.user {
  padding: 20px;
}
</style>