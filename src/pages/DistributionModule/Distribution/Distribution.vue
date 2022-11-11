<template>
  <div class="distribution">
    <div class="top-card">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item,index) in state.panels" :key="item.label">
          <el-card shadow="hover" style="cursor: pointer;border: none">
            <div class="cart-main">
              <div class="cart-left" :style="{backgroundColor: icons[index].bgc}">
                <el-icon :size="25" color="#FFFFFF">
                  <component :is="icons[index].icon"></component>
                </el-icon>
              </div>
              <div class="cart-right">
                <div class="cart-value">{{ item.value }}</div>
                <div class="caret-label">{{ item.label }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="main-table">
      <Search v-model="tableHeight" @reset="reset" @search="_table.search" @refresh="_table.getDataList" :subtract-height="120">
        <template #search>
          <el-form-item label="关键词：">
            <el-input placeholder="手机号/邮箱/用户昵称" v-model="state.dataForm.keyword" clearable
                      style="width: 200px;"/>
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
        </template>

        <template #button>
          <div style="display: flex">
            时间选择
            <el-check-tag v-for="item in tags" style="margin-left: 10px" :checked="state.dataForm.type === item.value"
                          @change="onChange(item.value)" :key="item.value">
              {{ item.text }}
            </el-check-tag>
          </div>
        </template>

        <template #table>
          <el-table :height="tableHeight" border :data="_table.tableInfo.dataList" style="width: 100%">
            <el-table-column prop="id" label="ID" min-width="60" align="center"/>
            <el-table-column label="头像" width="80" align="center" header-align="center">
              <template #default="{ row }">
                <el-image :src="row.avatar" fit="cover" style="width: 50px;height: 50px;border-radius: 25px"/>
              </template>
            </el-table-column>
            <el-table-column label="用户信息" min-width="180">
              <template #default="{ row }">
                <div>用户：{{ row.username }}</div>
                <div>昵称：{{ row.nickname }}</div>
                <div>姓名：{{ row.user_info.name }}</div>
                <div>电话：{{ row.phone }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="share_num" label="推广用户数量" min-width="120" align="center"
                             header-align="center"/>
            <el-table-column prop="share_order_num" label="订单数量" min-width="100" align="center"
                             header-align="center"/>
            <el-table-column prop="order_price" label="订单金额" min-width="100" align="center" header-align="center"/>
            <el-table-column prop="commission" label="账户佣金" min-width="100" align="center" header-align="center"/>
            <el-table-column prop="cash_out_price" label="已提现金额" min-width="120" align="center"
                             header-align="center"/>
            <el-table-column prop="cash_out_time" label="提现次数" min-width="100" align="center"
                             header-align="center"/>
            <el-table-column prop="no_cash_out_price" label="未天现金额" min-width="120" align="center"
                             header-align="center"/>
            <el-table-column label="操作" fixed="right" width="160px" header-align="center" align="center">
              <template #default="{ row }">
                <el-button type="text" style="margin-left: 10px" @click="openPromoter(row,'promoter')">推广人</el-button>
                <el-button type="text" style="margin-left: 10px" @click="openPromoter(row,'order')">推广订单</el-button>
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

    <!--推广人弹窗-->
    <PromoterDialog v-model="state.promoterVisiable" :info="state.promoterInfo"/>
  </div>
</template>

<script setup>
import Search from '@/components/Search.vue'
import {onMounted, reactive, ref} from "vue";
import TableView from "@/utils/useView.js";
import {getDistribution} from '@/request/api/DistributionModule.js'
import {ElMessage} from "element-plus";
import PromoterDialog from './cpns/PromoterDialog.vue'

const formRef = ref()
const tableHeight = ref()
const icons = [
  {icon: 'Van', bgc: '#60a5fa'},
  {icon: 'ShoppingCartFull', bgc: '#fb923c'},
  {icon: 'Wallet', bgc: '#34d399'},
  {icon: 'Odometer', bgc: '#818cf8'}]
const tags = [
  {text: '全部', value: 'all'},
  {text: '今天', value: 'today'},
  {text: '昨天', value: 'yesterday'},
  {text: '近七天', value: 'last7days'}
]

const state = reactive({
  url: '/admin/agent',
  deleteUrl: '/admin/agent',
  addUrl: '/admin/agent',
  updateUrl: '/admin/agent',
  title: '', //抽屉标题
  id: null, //修改的数据id
  drawer: false,  //抽屉显示隐藏
  panels: [], //顶部卡片信息
  promoterVisiable: false, //推广人弹窗
  promoterInfo: {},
  dataForm: { //搜索数据
    type: 'all',
    keyword: '',
    starttime: undefined,
    endtime: undefined,
    // level: null, //用户类型
    // user_id: null //推广人id
  },
  formData: { //新增修改数据
    username: '',
  },
  rules: {
    username: {required: true, message: '请输入必填项', trigger: 'blur'},

  }
})

let _table = new TableView(state)

//获取其他数据
const getOtherInfo = async () => {
  let res = await getDistribution()
  if (res.code !== 200) {
    return ElMessage.error(res.msg + '!')
  }
  state.panels = res.data.panels
}

//tag切换
const onChange = (type) => {
  if (state.dataForm.type === type) return
  state.dataForm.type = type
  _table.getDataList()
}

//重置按钮
const reset = () => {
  state.dataForm.keyword = ''
  state.dataForm.starttime = undefined
  state.dataForm.endtime = undefined
  _table.getDataList()
}

//打开推广人弹窗
const openPromoter = (row, type) => {
  state.promoterInfo = {id: row.id, type}
  state.promoterVisiable = true
}

onMounted(async () => {
  getOtherInfo()
  _table.getDataList()
})
</script>

<style scoped lang="less">
.distribution {
  //padding: 20px;
  .top-card {
    padding: 10px 0 20px 0;
    background-color: #f1f2f5;
    .cart-main {
      display: flex;
      .cart-left {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        text-align: center;
        line-height: 64px;
      }
      .cart-right {
        margin-left: 20px;
        line-height: 25px;
        .cart-value {
          font-size: 18px;
          font-weight: bold;
        }
        .caret-label {
          font-size: 14px;
          color: #aaaaaa;
        }
      }
    }
  }
  .main-table {
    padding: 20px;
  }
}
</style>