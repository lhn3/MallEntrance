<template>
  <div class="manager">
    <Search v-model="tableHeight" @reset="_table.reset" @search="_table.search" @refresh="_table.getDataList">
      <template #search>
        <el-form-item label="管理员昵称：">
          <el-input placeholder="请输入" v-model="state.dataForm.keyword" clearable/>
        </el-form-item>
      </template>

      <template #button>
        <el-button type="primary" @click="openDrawer">新增</el-button>
      </template>

      <template #table>
        <el-table :height="tableHeight" :data="_table.tableInfo.dataList" style="width: 100%">
          <el-table-column prop="title" label="管理员" header-align="center">
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
          <el-table-column prop="content" label="所属管理员" header-align="center" align="center">
            <template #default="{ row }">
              {{ row.role.name }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" header-align="center" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                         @change="(value) => _table.changeStatus(value, row.id)" :disabled="row.super === 1"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150px" header-align="center" align="center">
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
        <el-input v-model.trim="state.formData.username" placeholder="请输入用户名" clearable/>
      </el-form-item>
      <el-form-item prop="password" label="密码：">
        <el-input type="password" placeholder="请输入密码" v-model="state.formData.password" maxlength="18" clearable/>
      </el-form-item>
      <el-form-item prop="avatar" label="头像：">
        <ImageSelect v-model="state.formData.avatar"/>
      </el-form-item>
      <el-form-item prop="role_id" label="所属管理员：">
        <el-select v-model="state.formData.role_id" placeholder="请选择" clearable>
          <el-option
              v-for="item in state.roles"
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
  url: '/admin/manager',
  deleteUrl: '/admin/manager',
  addUrl: '/admin/manager',
  updateUrl: '/admin/manager',
  roles: [],
  title: '', //抽屉标题
  id: null, //修改的数据id
  drawer: false,  //抽屉显示隐藏
  dataForm: { //搜索数据
    keyword: ''
  },
  formData: { //新增修改数据
    username: '',
    password: '',
    avatar: [],
    role_id: '',
    status: ''
  },
  rules: {
    username: {required: true, message: '请输入必填项', trigger: 'blur'},
    password: {required: true, message: '请输入必填项', trigger: 'blur'},
    role_id: {required: true, message: '请选择必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList().then(res => {
    state.roles = res.data.roles
  })
})

//新增
const openDrawer = () => {
  state.title = '新增公告'
  state.formData.status = 1
  state.drawer = true
}

//修改
const editDrawer = (row) => {
  state.title = '修改公告'
  state.id = row.id
  state.formData.username = row.username
  state.formData.password = row.password
  state.formData.avatar = [row.avatar]
  state.formData.role_id = row.role.id
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
  state.formData.role_id = ''
  state.formData.status = ''
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
.manager {
  padding: 20px;
}
</style>