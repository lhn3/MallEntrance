<template>
  <div class="notice">
    <Search v-model="tableHeight" @refresh="_table.getDataList">
      <template #button>
        <el-button type="primary" @click="openDrawer">新增</el-button>
      </template>

      <template #table>
        <el-table :height="tableHeight" :data="_table.tableInfo.dataList" border style="width: 100%"
                  @cell-dblclick="editDrawer">
          <el-table-column prop="title" label="公告标题" header-align="center" align="center"/>
          <el-table-column prop="content" label="公告内容" header-align="center" align="center"/>
          <el-table-column prop="update_time" label="发布时间" header-align="center" align="center"/>
          <el-table-column label="操作" fixed="right" width="150px" header-align="center" align="center">
            <template #default="{ row }">
              <el-button type="text" @click="editDrawer(row)">修改</el-button>
              <el-button type="text" style="color: #f46c6c" @click="_table.deleteHandle(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template #pagination>
        <el-pagination class="pagination"
                       background
                       :current-page="_table.tableInfo.page"
                       :page-size="_table.tableInfo.limit"
                       :total="_table.tableInfo.total"
                       layout="prev, pager, next"
                       @current-change="_table.pageCurrentChangeHandle"/>
      </template>
    </Search>
  </div>
  <!--  分类抽屉-->
  <FormDrawer v-model="state.drawer" :title="state.title" :loading="_table.tableInfo.loading" @handleClose="drawerClose"
              @onSubmit="drawerSubmit">
    <el-form ref="formRef" :model="state.formData" :rules="state.rules" label-width="100px">
      <el-form-item prop="title" label="公告标题：">
        <el-input v-model.trim="state.formData.title" placeholder="请输入" clearable/>
      </el-form-item>
      <el-form-item prop="content" label="公告内容：">
        <el-input type="textarea" placeholder="请输入" v-model="state.formData.content"
                  maxlength="200" show-word-limit :rows="5" clearable/>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import Search from '@/components/Search.vue'
import {onMounted, reactive, ref} from "vue";
import TableView from '@/utils/useView.js'

const formRef = ref()
const tableHeight = ref()
const state = reactive({
  url:'/admin/notice',
  deleteUrl: '/admin/notice',
  addUrl: '/admin/notice',
  updateUrl: '/admin/notice',
  drawer: false,
  title: '',
  id: null,
  formData: {
    title: '',
    content: ''
  },
  rules: {
    title: {required: true, message: '请输入必填项', trigger: 'blur'},
    content: {required: true, message: '请输入必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList()
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
  state.formData.title = row.title
  state.formData.content = row.content
  state.drawer = true
}

//关闭右侧抽屉
const drawerClose = () => {
  formRef.value.resetFields()
  state.title = ''
  state.id = null
  state.formData.title = ''
  state.formData.content = ''
  state.drawer = false
}

//提交侧抽屉
const drawerSubmit = () => {
  _table.addOrUpdate(formRef.value, state.formData, state.id).then(res => {
    if (res) drawerClose()
  })
}
</script>

<style scoped lang="less">
.notice {
  padding: 20px;
  .pagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}
</style>