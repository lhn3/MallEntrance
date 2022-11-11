<template>
  <el-dialog v-model="props.modelValue" custom-class="custom-dialog" @close="cancel">
    <template #header>选择商品</template>
    <Search @reset="_table.reset" @search="_table.search" @refresh="_table.getDataList">
      <template #search>
        <el-form-item label="商品名称：">
          <el-input placeholder="请输入" v-model="state.dataForm.title" clearable/>
        </el-form-item>
      </template>

      <template #table>
        <el-table ref="tableRef" height="calc(78vh - 240px)" border :data="_table.tableInfo.dataList"
                  style="width: 100%" @selection-change="selectHandel">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="title" label="商品" header-align="center" width="320px">
            <template #default="{ row }">
              <div style="display: flex;padding: 5px;width: 300px">
                <el-image :src="row.cover" fit="cover" style="width: 80px;height: 80px;border-radius: 10px"/>
                <div style="padding-left: 10px;line-height: 20px;color: #929292;font-size: 12px">
                  <div class="text-ellipsis" style="color: #000000;font-size: 16px;font-weight: bold;width: 200px">
                    {{ row.title }}
                  </div>
                  <div style="font-size: 14px"><span style="color: #f84141">￥{{ row.min_price }}</span> |
                    <span>￥{{ row.min_oprice }}</span></div>
                  <div>分类：{{ row.category?.name }}</div>
                  <div>创建时间：{{ row.create_time }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sale_count" label="实际销售量" header-align="center" align="center"/>
          <el-table-column prop="stock" label="总库存" header-align="center" align="center"/>
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
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {defineProps, defineEmits, watch, nextTick, ref, reactive} from "vue";
import Search from '@/components/Search.vue'
import TableView from "@/utils/useView.js";
import {ElMessage} from "element-plus";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'handelSection'])
const tableRef = ref()
const state = reactive({
  url: '/admin/goods',
  selectList: [],
  dataForm: { //新增修改数据
    title: ''
  }
})

let _table = new TableView(state)

watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        console.log(123)
        state.selectList = []
        state.dataForm.title = ''
        _table.getDataList()
        nextTick(() => {
          tableRef.value.clearSelection()
        })
      }
    }
)

//选择
const selectHandel = selection => {
  state.selectList = selection
}

//关闭右侧抽屉
const cancel = () => {
  emit('update:modelValue')
}

const submit = async () => {
  if (state.selectList.length === 0) return ElMessage.error('请选择需要关联的商品！')
  emit('handelSection', state.selectList)
  emit('update:modelValue')
}
</script>

<style scoped>

</style>