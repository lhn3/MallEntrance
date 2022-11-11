<template>
  <div class="level">
    <Search v-model="tableHeight" @refresh="_table.getDataList">
      <template #button>
        <el-button type="primary" @click="openDrawer">新增</el-button>
      </template>
      <template #table>
        <el-table ref="tableRef" :height="tableHeight" :data="_table.tableInfo.dataList" border
                  style="width: 100%" @cell-dblclick="editDrawer">
          <el-table-column prop="name" label="会员等级" header-align="center" align="center"/>
          <el-table-column label="折扣率" header-align="center" align="center">
            <template #default="{ row }">
              {{ `${row.discount}%` }}
            </template>
          </el-table-column>
          <el-table-column prop="level" label="等级序号" header-align="center" align="center"/>
          <el-table-column prop="status" label="状态" header-align="center" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                         @change="(value) => _table.changeStatus(value, row.id)"/>
            </template>
          </el-table-column>
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

    <!--  分类抽屉-->
    <FormDrawer destroyOnClose v-model="state.drawer" :title="state.title" :loading="_table.tableInfo.loading"
                @handleClose="drawerClose" @onSubmit="drawerSubmit">
      <el-form ref="formRef" :model="state.formData" :rules="state.rules" label-width="140px">
        <el-form-item prop="name" label="会员等级：">
          <el-input v-model.trim="state.formData.name" placeholder="请输入" clearable style="width: 220px"/>
        </el-form-item>
        <el-form-item prop="level" label="会员权重：">
          <el-input-number :controls="false" v-model="state.formData.level" :min="0" precision="0" placeholder="请输入"
                           style="width: 220px;text-align: left"/>
        </el-form-item>
        <el-form-item prop="discount" label="折扣率：">
          <el-input-number :controls="false" v-model="state.formData.discount" :min="0" precision="0"
                           placeholder="请输入" style="width: 183px"/>
          <div class="unit-tip">%</div>
        </el-form-item>
        <el-form-item prop="max_price" label="累计消费金额：">
          <el-input-number :controls="false" v-model="state.formData.max_price" :min="0" precision="2"
                           placeholder="请输入" style="width: 183px"/>
          <div class="unit-tip">元</div>
        </el-form-item>
        <el-form-item prop="max_times" label="累计消费次数：">
          <el-input-number :controls="false" v-model="state.formData.max_times" :min="0" precision="0"
                           placeholder="请输入" style="width: 183px"/>
          <div class="unit-tip">次</div>
        </el-form-item>
        <el-form-item prop="status" label="状态：">
          <el-switch v-model="state.formData.status" :active-value="1" :inactive-value="0"/>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import Search from '@/components/Search.vue'
import {onMounted, reactive, ref} from "vue";
import TableView from '@/utils/useView.js'

const formRef = ref()
const tableRef = ref()
const tableHeight = ref()
const state = reactive({
  url: '/admin/user_level',
  deleteUrl: '/admin/user_level',
  addUrl: '/admin/user_level',
  updateUrl: '/admin/user_level',
  drawer: false,
  title: '',
  id: null,
  formData: {
    name: '',
    level: undefined,
    discount: undefined,
    max_price: undefined,
    max_times: undefined,
    status: 1
  },
  rules: {
    name: {required: true, message: '请输入必填项', trigger: 'blur'},
    level: {required: true, message: '请添加必填项', trigger: 'blur'},
    discount: {required: true, message: '请输入必填项', trigger: 'blur'},
    max_price: {required: true, message: '请输入必填项', trigger: 'blur'},
    max_times: {required: true, message: '请输入必填项', trigger: 'blur'},
    status: {required: true, message: '请输入必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList()
})

//新增
const openDrawer = () => {
  state.title = '新增会员'
  state.drawer = true
}

//修改
const editDrawer = (row) => {
  state.title = '修改公告'
  state.id = row.id
  state.formData.name = row.name
  state.formData.level = row.level
  state.formData.discount = row.discount
  state.formData.max_price = row.max_price
  state.formData.max_times = row.max_times
  state.formData.status = row.status
  state.drawer = true
}

//关闭右侧抽屉
const drawerClose = () => {
  formRef.value.resetFields()
  state.title = ''
  state.id = null
  state.formData.name = ''
  state.formData.level = undefined
  state.formData.discount = undefined
  state.formData.max_price = undefined
  state.formData.max_times = undefined
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
.level {
  padding: 20px;
  .pagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}
</style>