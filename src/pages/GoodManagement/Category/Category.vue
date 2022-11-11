<template>
  <div class="category">
    <Search v-model="tableHeight" @refresh="_table.getDataList">
      <template #button>
        <el-button type="primary" @click="openDialog">新增</el-button>
      </template>
    </Search>

    <el-tree
        :style="{height: tableHeight,overflow: 'scroll',overflowX: 'hidden'}"
        :data="_table.tableInfo.dataList"
        node-key="id"
        expand-on-click-node
        :props="{label: 'name', children: 'child'}"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <div>
            <span style="margin-left: 10px">{{ data.name }}</span>
          </div>
          <span @click.stop="() => {}">
            <el-button type="text" @click="openDrawer(data)">推荐商品</el-button>
            <el-switch v-model="data.status" style="margin: 0 10px" :active-value="1" :inactive-value="0"
                       @change="(value) => _table.changeStatus(value,data.id)"/>
            <el-button type="text" @click="openDialog(data)">修改</el-button>
            <el-button type="text" style="color: #f46c6c" @click="_table.deleteHandle(data.id)">删除</el-button>
          </span>
        </span>
      </template>
    </el-tree>

    <!--新增修改-->
    <el-dialog v-model="state.dialogVisible" :title="state.title" width="30%" draggable>
      <el-form v-if="state.dialogVisible" ref="formRef" :model="state.formData" :rules="state.rules">
        <el-form-item prop="name" label="分类名称">
          <el-input v-model="state.formData.name" maxlength="15" placeholder="请输入" clearable/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="state.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>

    <!--    推荐商品-->
    <FormDrawer width="40%" v-model="state.drawer" :title="state.title" :loading="_table.tableInfo.loading"
                close-on-click-modal>
      <el-button type="primary" style="margin-bottom: 20px" @click="state.contactVisible = true">添加关联</el-button>
      <el-table height="calc(100vh - 220px)" border :data="state.tableList" style="width: 100%">
        <el-table-column type="index" label="序号" header-align="center" align="center" min-width="50"/>
        <el-table-column prop="id" label="ID" header-align="center" align="center" width="80"/>
        <el-table-column label="商品" header-align="center" width="105">
          <template #default="{ row }">
            <el-image :src="row.cover" fit="cover" style="width: 80px;height: 80px;border-radius: 4px"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" header-align="center" align="center" min-width="300"/>
        <el-table-column label="操作" width="80" fixed="right" header-align="center" align="center">
          <template #default="{ row }">
            <el-button type="text" style="color: #f46c6c" @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </FormDrawer>

<!--    选择商品的弹窗-->
    <GoodsDialog v-model="state.contactVisible" @handelSection="handelSection"/>
  </div>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import Search from '@/components/Search.vue'
import GoodsDialog from './cpns/GoodsDialog.vue'
import {onMounted, reactive, ref} from "vue";
import TableView from "@/utils/useView.js";
import {deleteCategoryRow, addCategoryGoods} from '@/request/api/goodManagement.js'
import {messageBox} from "@/utils/message.js";
import {ElMessage} from "element-plus";

const formRef = ref()
const tableHeight = ref()
const state = reactive({
  url: '/admin/category',
  deleteUrl: '/admin/category',
  addUrl: '/admin/category',
  updateUrl: '/admin/category',
  isPage: false,
  title: '', //标题
  id: null, //修改的数据id
  dialogVisible: false,
  drawer: false,
  contactVisible: false,
  tableList: [],
  formData: { //新增修改数据
    name: ''
  },
  rules: {
    name: {required: true, message: '请选择必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList()
})

//新增或修改
const openDialog = row => {
  if (row) {
    state.title = '修改分类'
    state.formData.name = row.name
    state.id = row.id
  } else {
    state.title = '新增分类'
    state.formData.name = ''
  }
  state.dialogVisible = true
}

//新增修改提交
const submit = () => {
  _table.addOrUpdate(formRef.value, state.formData, state.id).then(res => {
    if (res) state.dialogVisible = false
  })
}

//打开推荐商品的抽屉
const openDrawer = row => {
  state.title = '推荐商品'
  state.id = row.id
  _table.getOtherInfo('/admin/app_category_item/list?category_id=' + state.id).then(res => {
    state.tableList = res.data
    state.drawer = true
  })
}

//删除行
const deleteRow = async row => {
  messageBox('确认删除？').then(async r => {
    if (!r) return
    let res = await deleteCategoryRow(row.id)
    if (res.code !== 200) {
      return ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    }
    ElMessage.success('删除成功~')
    state.tableList = state.tableList.filter(item => item.id !== row.id)
  })

}

//添加关联
const handelSection = async data => {
  let goods_ids = data.map(item => item.id)
  let res = await addCategoryGoods({category_id: state.id, goods_ids})
  if (res.code !== 200) {
    return ElMessage({
      message: res.msg + '!',
      type: 'error',
      dangerouslyUseHTMLString: true
    })
  }
  ElMessage.success('关联成功~')
  _table.getOtherInfo('/admin/app_category_item/list?category_id=' + state.id).then(r => {
    state.tableList = r.data
  })
}
</script>

<style scoped lang="less">
.category {
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
:deep(.el-dialog) {
  border-radius: 10px;
}
</style>