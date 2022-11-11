<template>
  <div class="role">
    <Search @refresh="_table.getDataList">
      <template #button>
        <el-button type="primary" @click="openDrawer">新增</el-button>
      </template>
      <template #table>
        <el-table height="calc(100vh - 270px)" :data="_table.tableInfo.dataList" style="width: 100%"
                  @cell-dblclick="editDrawer">
          <el-table-column prop="name" label="角色名称" header-align="center" align="center"/>
          <el-table-column prop="desc" label="角色描述" header-align="center" align="center"/>
          <el-table-column prop="status" label="状态" header-align="center" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                         @change="(value) => _table.changeStatus(value, row.id)"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180px" header-align="center" align="center">
            <template #default="{ row }">
              <el-button type="text" @click="editAccess(row)">配置权限</el-button>
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
    <el-tree
        ref="treeRef"
        v-if="state.title === '配置权限'"
        :data="state.rulesList"
        node-key="id"
        expand-on-click-node
        :props="{label: 'name', children: 'child'}"
        :default-checked-keys="state.formData.rules"
        show-checkbox
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <div>
            <el-tag v-if="data.menu" type="success" effect="plain">菜单</el-tag>
            <el-tag v-else type="warning" effect="plain">权限</el-tag>
            <span style="margin-left: 10px">{{ data.name }}</span>
          </div>
        </span>
      </template>
    </el-tree>
    <el-form v-else ref="formRef" :model="state.formData" :rules="state.rules" label-width="100px">
      <el-form-item prop="name" label="角色名称：">
        <el-input v-model.trim="state.formData.name" placeholder="请输入" clearable/>
      </el-form-item>
      <el-form-item prop="desc" label="角色描述：">
        <el-input type="textarea" placeholder="请输入" v-model="state.formData.desc"
                  maxlength="200" show-word-limit :rows="5" clearable/>
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
import {onMounted, reactive, ref} from "vue";
import TableView from '@/utils/useView.js'

const treeRef = ref()
const formRef = ref()
const state = reactive({
  url: '/admin/role',
  deleteUrl: '/admin/role',
  addUrl: '/admin/role',
  updateUrl: '/admin/role',
  rulesList: [],
  drawer: false,
  title: '',
  id: null,
  formData: {
    name: '',
    desc: '',
    status: 1,
    rules: []
  },
  rules: {
    name: {required: true, message: '请输入必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(async () => {
  _table.getDataList()
  _table.getOtherInfo('/admin/rule/1')?.then(res => {
    state.rulesList = res.data.list
  })
})

//新增
const openDrawer = () => {
  state.title = '新增用户'
  state.drawer = true
}

//配置权限
const editAccess = (row) => {
  state.title = '配置权限'
  state.id = row.id
  state.formData.rules = row.rules.map(item => item.id)
  state.drawer = true
  console.log(state.formData.rules)
}

//修改
const editDrawer = (row) => {
  state.title = '修改用户'
  state.id = row.id
  state.formData.name = row.name
  state.formData.desc = row.desc
  state.formData.status = row.status
  state.drawer = true
}

//关闭右侧抽屉
const drawerClose = () => {
  formRef.value?.resetFields()
  state.drawer = false
  state.id = null
  state.formData.name = ''
  state.formData.desc = ''
  state.formData.status = 1
  state.formData.rules = []
  state.title = ''
}

//提交侧抽屉
const drawerSubmit = () => {
  if (state.title === '配置权限') {
    let rule_ids = treeRef.value.getCheckedNodes().map(item => item.id)
    _table.updateOther('/admin/role/set_rules', {id: state.id, rule_ids}).then(res => {
      if (res) drawerClose()
    })
  } else {
    _table.addOrUpdate(formRef.value, state.formData, state.id).then(res => {
      if (res) drawerClose()
    })
  }
}
</script>

<style scoped lang="less">
.role {
  padding: 20px;
  .pagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
:deep(.el-tree-node__content) {
  height: 40px;
}
</style>