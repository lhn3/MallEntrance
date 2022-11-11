<template>
  <div class="access">
    <Search @refresh="_table.getDataList">
      <template #button>
        <el-button type="primary" @click="openDrawer">新增</el-button>
      </template>
    </Search>

    <el-tree
        style="height: calc(100vh - 240px);overflow: scroll;overflow-x: hidden"
        :data="_table.tableInfo.dataList"
        node-key="id"
        expand-on-click-node
        :props="{label: 'name', children: 'child'}"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <div>
            <el-tag v-if="data.menu" type="success" effect="plain">菜单</el-tag>
            <el-tag v-else type="warning" effect="plain">权限</el-tag>
            <el-icon v-if="data.icon" :size="18" style="margin-left: 10px">
              <component :is="data.icon"/>
            </el-icon>
            <span style="margin-left: 10px">{{ data.name }}</span>
          </div>
          <span @click.stop="() => {}">
            <el-switch v-model="data.status" style="margin-right: 10px" :active-value="1" :inactive-value="0"
                       @change="(value) => _table.changeStatus(value,data.id)"/>
            <el-button type="text" @click="editDrawer(data)">修改</el-button>
            <el-button v-if="data.menu" type="text" @click="addEditAccess(data)">增加</el-button>
            <el-button type="text" style="color: #f46c6c" @click="_table.deleteHandle(data.id)">删除</el-button>
          </span>
        </span>
      </template>
    </el-tree>
  </div>

  <!--  抽屉-->
  <FormDrawer v-model="state.drawer" :title="state.title" :loading="_table.tableInfo.loading"
              @handleClose="drawerClose" @onSubmit="drawerSubmit">
    <el-form ref="formRef" :model="state.formData" :rules="state.formDataRules" label-width="120px">
      <el-form-item prop="rule_id" label="上级菜单：">
        <el-cascader v-model="state.formData.rule_id" :options="state.rules" filterable clearable placeholder="请输入"
                     :props="{label: 'name', children: 'child', value: 'id', checkStrictly: true, emitPath: false}"/>
      </el-form-item>
      <el-form-item prop="menu" label="菜单/规则：">
        <el-radio-group v-model="state.formData.menu" @change="radioChange">
          <el-radio :label="1" border>菜单</el-radio>
          <el-radio :label="0" border>规则</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="name" label="名称：">
        <el-input v-model="state.formData.name" placeholder="请输入" clearable/>
      </el-form-item>
      <div v-if="state.formData.menu">
        <el-form-item prop="frontpath" label="前端路由：" v-if="state.formData.rule_id">
          <el-input v-model="state.formData.frontpath" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标：">
          <IconSelect v-model="state.formData.icon" />
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item prop="condition" label="后端规则：">
          <el-input v-model="state.formData.condition" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="method" label="请求方式：">
          <el-select v-model="state.formData.method" placeholder="请选择" clearable>
            <el-option v-for="item in methods" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item prop="order" label="排序：">
        <el-input-number v-model="state.formData.order" min="0" precision="0"/>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import IconSelect from "@/components/IconSelect.vue";
import Search from '@/components/Search.vue'
import {onMounted, reactive, ref} from "vue";
import TableView from "@/utils/useView.js";

const formRef = ref()
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const state = reactive({
  url: '/admin/rule',
  deleteUrl: '/admin/rule',
  addUrl: '/admin/rule',
  updateUrl: '/admin/rule',
  rules: [],
  title: '', //抽屉标题
  id: null, //修改的数据id
  drawer: false,  //抽屉显示隐藏
  formData: { //新增修改数据
    rule_id: '',
    menu: 1,
    name: '',
    icon: '',
    condition: '',
    method: '',
    status: 1,
    order: 0,
    frontpath: ''
  },
  formDataRules: {
    frontpath: {required: true, message: '请选择必填项', trigger: 'blur'},
    name: {required: true, message: '请输入必填项', trigger: 'blur'},
    condition: {required: true, message: '请输入必填项', trigger: 'blur'},
    method: {required: true, message: '请选择必填项', trigger: 'blur'},
    order: {required: true, message: '请输入必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList().then(res => {
    state.rules = res.data.rules
    console.log(res)
  })
})

//新增
const openDrawer = () => {
  state.title = '新增菜单/权限'
  state.drawer = true
}

//修改
const editDrawer = (row) => {
  state.title = '修改权菜单/权限'
  state.id = row.id
  state.formData.rule_id = row.rule_id
  state.formData.menu = row.menu
  state.formData.name = row.name
  state.formData.icon = row.icon
  state.formData.condition = row.condition
  state.formData.method = row.method
  state.formData.frontpath = row.frontpath
  state.formData.order = row.order
  state.drawer = true
}

//增加
const addEditAccess = (row) => {
  console.log(row)
  state.title = '增加子菜单/权限'
  state.formData.rule_id = row.id
  state.formData.menu = row.child[0]?.menu ?? row.menu
  state.drawer = true
}

//关闭右侧抽屉
const drawerClose = () => {
  formRef.value.resetFields()
  state.title = ''
  state.id = null
  state.formData.rule_id = ''
  state.formData.menu = 1
  state.formData.name = ''
  state.formData.icon = ''
  state.formData.condition = ''
  state.formData.method = ''
  state.formData.frontpath = ''
  state.formData.order = 0
  state.drawer = false
}

//菜单规则切换
const radioChange = value => {
  if (value) {
    state.formData.condition = ''
    state.formData.method = ''
  } else {
    state.formData.icon = ''
    state.formData.frontpath = ''
  }
}

//提交
const drawerSubmit = () => {
  _table.addOrUpdate(formRef.value, state.formData, state.id).then(res => {
    if (res) drawerClose()
  })
}
</script>

<style scoped lang="less">
.access {
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
  height: 46px;
  border-bottom: 1px solid #eeeeee;
}
</style>