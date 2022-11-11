<template>
  <el-dialog :model-value="props.modelValue" :title="props.info.type === 'promoter' ? '推广人列表' : '推广人订单列表'"
             custom-class="custom-dialog" @close="cancel">
    <div style="width: 100%;position: relative">
      <el-form-item label="时间选择：">
        <el-radio-group v-model="state.dataForm.type">
          <el-radio-button v-for="item in timeList" :key="item.value" :label="item.value">
            {{ item.text }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间：">
        <el-date-picker
            v-model="state.dataForm.starttime"
            type="date"
            placeholder="请选择"
            style="width: 200px;"
            :editable="false"
            value-format="YYYY-MM-DD"
            clearable
        />
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker
            v-model="state.dataForm.endtime"
            type="date"
            placeholder="请选择"
            style="width: 200px;"
            :editable="false"
            value-format="YYYY-MM-DD"
            clearable
        />
      </el-form-item>
      <el-form-item label="用户类型：" v-if="props.info.type === 'promoter'">
        <el-radio-group v-model="state.dataForm.level">
          <el-radio-button v-for="item in userType" :key="item.value" :label="item.value">
            {{ item.text }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div style="display: flex;height: 32px;width: 140px;position:absolute;bottom: 0;right: 0">
        <el-button type="primary" @click="_table.getDataList">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>

    <el-table :height="props.info.type === 'promoter' ? 'calc(78vh - 387px)' : 'calc(78vh - 337px)'" border
              :data="_table.tableInfo.dataList" style="width: 100%">
      <template v-if="props.info.type === 'promoter'">
        <el-table-column prop="id" label="UID" min-width="60" align="center"/>
        <el-table-column label="头像" width="80" align="center" header-align="center">
          <template #default="{ row }">
            <el-image :src="row.avatar" fit="cover" style="width: 50px;height: 50px;border-radius: 25px"/>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="100" align="center" header-align="center"/>
        <el-table-column prop="share_num" label="推广用户数量" min-width="120" align="center"
                         header-align="center"/>
        <el-table-column prop="share_order_num" label="订单数量" min-width="100" align="center"
                         header-align="center"/>
        <el-table-column prop="create_time" label="绑定时间" min-width="100" align="center"
                         header-align="center"/>
      </template>
      <template v-if="props.info.type === 'order'">
        <el-table-column prop="create_time" label="订单号" min-width="100" align="center"
                         header-align="center">
          <template #default="{ row }">
            {{ row.order?.no }}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="用户名" min-width="100" align="center"
                         header-align="center">
          <template #default="{ row }">
            {{ row.order?.user?.username }}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="时间" min-width="100" align="center"
                         header-align="center"/>
        <el-table-column prop="commission" label="返佣金额" min-width="100" align="center"
                         header-align="center"/>
      </template>
    </el-table>
    <el-pagination style="margin-top: 10px;display: flex;justify-content: center;"
                   background
                   :current-page="_table.tableInfo.page"
                   :page-size="_table.tableInfo.limit"
                   :total="_table.tableInfo.total"
                   layout="prev, pager, next"
                   @current-change="_table.pageCurrentChangeHandle"/>
    <template #footer>
      <el-button @click="cancel">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, nextTick, reactive, watch} from 'vue'
import TableView from "@/utils/useView.js";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  info: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue'])
const timeList = [ //时间选择
  {text: '全部', value: 'all'},
  {text: '今天', value: 'today'},
  {text: '昨天', value: 'yesterday'},
  {text: '近七天', value: 'last7days'}
]

const userType = [ //用户类型
  {text: '全部', value: 0},
  {text: '一级推广', value: 1},
  {text: '二级推广', value: 2}
]

const state = reactive({
  dataForm: {
    user_id: undefined,
    type: 'all',
    starttime: undefined,
    endtime: undefined,
    level: 0
  }
})

const _table = new TableView(state)

watch(
    () => props.modelValue,
    newValue => {
      if (newValue) {
        state.dataForm.user_id = props.info.id
        if (props.info.type === 'promoter') {
          _table.tableInfo.url = '/admin/agent'
        } else {
          _table.tableInfo.url = '/admin/user_bill'
          state.dataForm.level = undefined
        }
        _table.getDataList()
      } else {
        _table.tableInfo.url = ''
        state.dataForm.user_id = undefined
        reset(false)
      }
    }
)

const reset = (re = true) => {
  state.dataForm.type = 'all'
  state.dataForm.starttime = undefined
  state.dataForm.endtime = undefined
  state.dataForm.level = 0
  if (re) _table.getDataList()
}

//取消
const cancel = () => {
  emit('update:modelValue')
}

</script>

<style scoped lang="less">
.card {
  margin-bottom: 20px;
  .card-header {
    font-size: 15px;
    font-weight: bold;
  }
  .card-line {
    line-height: 40px;
    span {
      color: #8d8d8e;
    }
  }
}

</style>