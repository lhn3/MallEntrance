<template>
  <div class="coupon">
    <Search  v-model="tableHeight" @refresh="_table.getDataList">
      <template #button>
        <el-button type="primary" @click="openDrawer">新增</el-button>
        <el-button type="danger" @click="_table.deleteHandle">批量删除</el-button>
      </template>
      <template #table>
        <el-table :height="tableHeight" :data="_table.tableInfo.dataList" style="width: 100%">
          <el-table-column label="优惠券名称" header-align="center" width="370px">
            <template #default="{ row }">
              <div class="coupon-cart" :class="{'active-coupon': formatStatus(row) === '进行中'}">
                <div class="coupon-cart-name">{{ row.name }}</div>
                <div class="coupon-cart-time">{{ row.start_time }} ~ {{ row.end_time }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" header-align="center" align="center">
            <template #default="{ row }">
              <el-tag size="large" v-if="formatStatus(row) === '已失效'" type="info">已失效</el-tag>
              <el-tag size="large" v-if="formatStatus(row) === '未开始'">未开始</el-tag>
              <el-tag size="large" v-if="formatStatus(row) === '进行中'" type="success">进行中</el-tag>
              <el-tag size="large" v-if="formatStatus(row) === '已结束'" type="warning">已结束</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="优惠" header-align="center" align="center">
            <template #default="{ row }">
              {{ row.type === 0 ? `满减：￥${row.value}` : `折扣：${row.value}折` }}
            </template>
          </el-table-column>
          <el-table-column prop="total" label="发放数量" header-align="center" align="center"/>
          <el-table-column prop="used" label="已使用" header-align="center" align="center"/>
          <el-table-column label="操作" fixed="right" width="150px" header-align="center" align="center">
            <template #default="{ row }">
              <el-button type="text" v-if="formatStatus(row) === '未开始'" @click="editDrawer(row)">修改</el-button>
              <el-button type="text"
                         v-if="formatStatus(row) !== '进行中'" style="color: #f46c6c" @click="_table.deleteHandle(row.id)">
                删除
              </el-button>
              <el-button type="text" v-if="formatStatus(row) === '进行中'" @click="changeStatus(row.id)">失效</el-button>
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
  <FormDrawer width="35%" v-model="state.drawer" :title="state.title" :loading="_table.tableInfo.loading"
              @handleClose="drawerClose"
              @onSubmit="drawerSubmit">
    <el-form ref="formRef" :model="state.formData" :rules="state.rules" label-width="130px">
      <el-form-item prop="name" label="优惠券名称：">
        <el-input v-model.trim="state.formData.name" placeholder="请输入" clearable/>
      </el-form-item>
      <el-form-item prop="type" label="类型：">
        <el-radio-group v-model="state.formData.type">
          <el-radio :label="1" border>折扣</el-radio>
          <el-radio :label="0" border>满减</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="value" label="面值：">
        <el-input-number :controls="false" min="0" precision="2" v-model="state.formData.value"
                         placeholder="请输入" clearable/>
        <div class="unit-tip">
          {{ state.formData.type ? '折' : '元' }}
        </div>
      </el-form-item>
      <el-form-item prop="total" label="发行量：">
        <el-input-number min="0" precision="0" v-model="state.formData.total"
                         placeholder="请输入" clearable/>
        <div class="unit-tip">张</div>
      </el-form-item>
      <el-form-item prop="min_price" label="最低使用价格：">
        <el-input-number :controls="false" v-model="state.formData.min_price" placeholder="请输入" min="0"
                         precision="2" clearable/>
        <div class="unit-tip">元</div>
      </el-form-item>
      <el-form-item prop="end_time" label="时间范围：">
        <el-date-picker
            :editable="false"
            v-model="state.timerange"
            type="datetimerange"
            range-separator="到"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="dateChange"
        />
      </el-form-item>
      <el-form-item prop="order" label="排序：">
        <el-input-number v-model="state.formData.order" min="0" precision="0"/>
      </el-form-item>
      <el-form-item prop="desc" label="描述：">
        <el-input type="textarea" placeholder="请输入" v-model="state.formData.desc"
                  maxlength="300" show-word-limit :rows="5" clearable/>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import Search from '@/components/Search.vue'
import {onMounted, reactive, ref} from "vue";
import TableView from '@/utils/useView.js'
import {messageBox} from "@/utils/message.js";

const formRef = ref()
const tableHeight = ref()
const state = reactive({
  url: '/admin/coupon',
  deleteUrl: '/admin/coupon',
  addUrl: '/admin/coupon',
  updateUrl: '/admin/coupon',
  drawer: false,
  title: '',
  id: null,
  formData: {
    name: '',
    type: 1,
    value: 0,
    total: 100,
    min_price: 0,
    start_time: null,
    end_time: null,
    order: 0,
    desc: ''
  },
  rules: {
    name: {required: true, message: '请输入必填项', trigger: 'blur'},
    value: {required: true, message: '请输入必填项', trigger: 'blur'},
    total: {required: true, message: '请输入必填项', trigger: 'blur'},
    min_price: {required: true, message: '请输入必填项', trigger: 'blur'},
    order: {required: true, message: '请输入必填项', trigger: 'blur'},
    end_time: {required: true, message: '请选择必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList()
})

const formatStatus = row => {
  let statusInfo = ''
  //获取开始结束当前时间的时间戳
  let startTime = (new Date(row.start_time)).getTime()
  let endTime = (new Date(row.end_time)).getTime()
  let now = (new Date()).getTime()
  if (row.status === 0) {
    statusInfo = '已失效'
  } else if (now < startTime) {
    statusInfo = '未开始'
  } else if (now >= startTime && now < endTime) {
    statusInfo = '进行中'
  } else if (now >= endTime) {
    statusInfo = '已结束'
  }
  return statusInfo
}

//新增
const openDrawer = () => {
  state.title = '新增公告'
  state.formData.type = 1
  state.formData.order = _table.tableInfo.dataList[0].order + 1
  state.drawer = true
}

//修改
const editDrawer = (row) => {
  state.title = '修改公告'
  state.id = row.id
  state.formData.name = row.name
  state.formData.type = row.type
  state.formData.value = row.value
  state.formData.total = row.total
  state.formData.min_price = row.min_price
  state.formData.start_time = (new Date(row.start_time)).getTime()
  state.formData.end_time = (new Date(row.end_time)).getTime()
  state.timerange = [state.formData.start_time, state.formData.end_time]
  state.formData.order = row.order
  state.formData.desc = row.desc
  state.drawer = true
}

//关闭右侧抽屉
const drawerClose = () => {
  formRef.value.resetFields()
  state.title = ''
  state.id = null
  state.formData.name = ''
  state.formData.type = 1
  state.formData.value = 0
  state.formData.total = 100
  state.formData.min_price = 0
  state.formData.start_time = null
  state.formData.end_time = null
  state.timerange = null
  state.formData.order = 0
  state.formData.desc = ''
  state.drawer = false
}

//失效按钮
const changeStatus = (id) => {
  messageBox('确认使优惠券失效！').then(async res => {
    if (res) _table.changeStatus(0, id)
  })
}

//选择时间
const dateChange = () => {
  //设置时间
  if (state.timerange) {
    state.formData.start_time = (new Date(state.timerange[0])).getTime()
    state.formData.end_time = (new Date(state.timerange[1])).getTime()
  }
}

//提交侧抽屉
const drawerSubmit = () => {
  _table.addOrUpdate(formRef.value, state.formData, state.id).then(res => {
    if (res) drawerClose()
  })
}
</script>

<style scoped lang="less">
.coupon {
  padding: 20px;
  .pagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
  .coupon-cart {
    height: 80px;
    width: 350px;
    padding: 15px 20px;
    border-radius: 10px;
    border: 1px dashed #dedede;
    background-color: #f4f4f4;
    color: #a0a0a0;
    .coupon-cart-name {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 6px;
    }
    .coupon-cart-time {
      font-size: 14px;
    }
  }
  .active-coupon {
    border: 1px dashed #ffc7c7;
    background-color: #ffeeee;
    color: #ff6a6a;
  }
}
</style>