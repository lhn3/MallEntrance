<template>
  <div class="skus">
    <Search v-model="tableHeight" @refresh="_table.getDataList">
      <template #button>
        <el-button type="primary" @click="openDrawer">新增</el-button>
        <el-button type="danger" @click="_table.deleteHandle">批量删除</el-button>
      </template>
      <template #table>
        <el-table ref="tableRef" :height="tableHeight" :data="_table.tableInfo.dataList" border style="width: 100%"
                  @cell-dblclick="editDrawer" @selection-change="_table.selectHandel">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="规格名称" header-align="center" align="center"/>
          <el-table-column prop="default" label="规格值" header-align="center" align="center"/>
          <el-table-column prop="order" label="排序" header-align="center" align="center"/>
          <el-table-column prop="status" label="状态" header-align="center" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                         @change="(value) => _table.changeStatus(value, row.id)"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150px" header-align="center" align="center">
            <template #default="{ row }">
              <el-button type="text" @click="editDrawer(row)">修改</el-button>
              <el-button type="text" style="color: #f46c6c" @click="_table.deleteHandle([row.id])">删除</el-button>
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
  <FormDrawer destroyOnClose v-model="state.drawer" :title="state.title" :loading="_table.tableInfo.loading" @handleClose="drawerClose"
              @onSubmit="drawerSubmit">
    <el-form ref="formRef" :model="state.formData" :rules="state.rules" label-width="100px">
      <el-form-item prop="name" label="规格名称：">
        <el-input v-model.trim="state.formData.name" placeholder="请输入" clearable/>
      </el-form-item>
      <el-form-item prop="default" label="规格值：">
<!--        <el-input placeholder="请输入" v-model="state.formData.default" clearable/>-->
        <TagInput v-model="state.formData.default" />
      </el-form-item>
      <el-form-item prop="order" label="排序：">
        <el-input-number v-model="state.formData.order" min="0" precision="0"/>
      </el-form-item>
      <el-form-item prop="status" label="状态：">
        <el-switch v-model="state.formData.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import Search from '@/components/Search.vue'
import {onMounted, reactive, ref} from "vue";
import TableView from '@/utils/useView.js'
import TagInput from '@/components/TagInput.vue'

const formRef = ref()
const tableRef = ref()
const tableHeight = ref()
const state = reactive({
  url:'/admin/skus',
  deleteUrl: '/admin/skus',
  addUrl: '/admin/skus',
  updateUrl: '/admin/skus',
  drawer: false,
  title: '',
  id: null,
  formData: {
    name: '',
    default: '',
    order: 0,
    status: 1
  },
  rules: {
    name: {required: true, message: '请输入必填项', trigger: 'blur'},
    default: {required: true, message: '请添加必填项', trigger: 'blur'},
    order: {required: true, message: '请输入必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList()
})

//新增
const openDrawer = () => {
  state.title = '新增公告'
  state.formData.order = _table.tableInfo.dataList[0].order + 1
  state.drawer = true
}

//修改
const editDrawer = (row) => {
  state.title = '修改公告'
  state.id = row.id
  state.formData.name = row.name
  state.formData.default = row.default
  state.formData.order = row.order
  state.formData.status = row.status
  state.drawer = true
}

//关闭右侧抽屉
const drawerClose = () => {
  formRef.value.resetFields()
  state.title = ''
  state.id = null
  state.formData.name = ''
  state.formData.default = ''
  state.formData.order = 0
  state.formData.status = 1
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
.skus {
  padding: 20px;
  .pagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}
</style>