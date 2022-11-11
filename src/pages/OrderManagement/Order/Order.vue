<template>
  <div class="goods">
    <el-tabs v-model="state.dataForm.tab" @tab-change="_table.getDataList">
      <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabs" :key="item.name"/>
    </el-tabs>

    <Search v-model="tableHeight" @reset="reset" @search="_table.search" @refresh="_table.getDataList" :subtract-height="54">
      <template #search>
        <el-form-item label="订单号：">
          <el-input placeholder="请输入" v-model="state.dataForm.no" clearable style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="收货人：">
          <el-input placeholder="请输入" v-model="state.dataForm.name" clearable style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="收货人手机号：">
          <el-input placeholder="请输入" v-model="state.dataForm.phone" clearable style="width: 200px;"/>
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
        <el-button @click="state.exportDialog = true">导出订单</el-button>
        <el-button type="danger" @click="_table.deleteHandle">批量删除</el-button>
      </template>

      <template #table>
        <el-table :height="tableHeight" border :data="_table.tableInfo.dataList" style="width: 100%"
                  @selection-change="_table.selectHandel" stripe @row-dblclick="openDetail">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="商品" min-width="270px">
            <template #default="{ row }">
              <div>订单号：{{ row.no }}</div>
              <div>下单时间：{{ row.create_time }}</div>
              <div style="display: flex;padding: 5px;width: 240px" v-for="item in row.order_items" :key="item.id">
                <el-image :src="item.goods_item?.cover" fit="cover"
                          style="width: 30px;height: 30px;border-radius: 5px"/>
                <div class="text-ellipsis"
                     style="padding-left: 10px;line-height: 30px;color: #929292;font-size: 12px;width: calc(100% - 30px)">
                  {{ item.goods_item?.title }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="实付款" header-align="center" align="center">
            <template #default="{ row }">
              {{ row.total_price }}￥
            </template>
          </el-table-column>
          <el-table-column prop="status" label="购买用户" min-width="200">
            <template #default="{ row }">
              <div style="display: flex;padding: 5px">
                <el-image :src="row.user?.avatar" fit="cover" style="width: 50px;height: 50px;border-radius: 25px"/>
                <div style="padding-left: 20px">
                  <div style="line-height: 25px">{{ row.user?.username }}</div>
                  <div style="line-height: 25px">ID：{{ row.user?.id }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="交易状态" min-width="180">
            <template #default="{ row }">
              <div>付款状态：
                <el-tag size="small" v-if="row.payment_method === 'alipay'">支付宝支付</el-tag>
                <el-tag size="small" v-else-if="row.payment_method === 'wechat'" type="success">微信支付</el-tag>
                <el-tag size="small" v-else type="info">未支付</el-tag>
              </div>
              <div>发货状态：
                <el-tag size="small" v-if="!row.ship_data" type="info">未发货</el-tag>
                <el-tag size="small" v-else type="success">已发货</el-tag>
              </div>
              <div>收货状态：
                <el-tag size="small" v-if="row.ship_status=== 'received'" type="success">已收货</el-tag>
                <el-tag size="small" v-else type="info">未收货</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100px" header-align="center" align="center">
            <template #default="{ row }">
              <el-button type="text" style="margin-left: 10px" @click="openDetail(row)">订单详情</el-button>
<!--              <el-button v-if="state.dataForm.tab === 'noship'" type="text">订单发货</el-button>-->
              <el-button v-if="state.dataForm.tab === 'refunding'" type="text" @click="refundClick(row,1)">
                同意退款
              </el-button>
              <el-button v-if="state.dataForm.tab === 'refunding'" type="text" @click="refundClick(row,0)">
                拒绝退款
              </el-button>
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

    <!--导出弹窗-->
    <ExportOrder v-model="state.exportDialog" :tabs="tabs"/>

    <!--订单详情-->
    <OrderDetail v-model="state.detailDialog" :rowDetail="state.rowDetail"/>
  </div>
</template>

<script setup>
import Search from '@/components/Search.vue'
import ExportOrder from './cpns/ExportOrder.vue'
import OrderDetail from './cpns/OrderDetail.vue'
import {onMounted, reactive, ref} from "vue";
import TableView from "@/utils/useView.js";
import {ElMessageBox} from "element-plus";
import {messageBox} from "@/utils/message.js";

const tabs = ref([
  {label: '全部', name: 'all'},
  {label: '待付款', name: 'nopay'},
  {label: '待发货', name: 'noship'},
  {label: '已发货', name: 'shiped'},
  {label: '已收货', name: 'received'},
  {label: '已完成', name: 'finish'},
  {label: '已关闭', name: 'closed'},
  {label: '退款中', name: 'refunding'},
])
const formRef = ref()
const tableHeight = ref()
const state = reactive({
  url: '/admin/order',
  deleteUrl: '/admin/order',
  addUrl: '/admin/order',
  updateUrl: '/admin/order',
  exportDialog: false, //导出弹窗
  detailDialog: false, //详情弹窗
  rowDetail: {}, //详情弹窗
  dataForm: { //搜索数据
    tab: 'all',
    no: '',
    starttime: undefined,
    endtime: undefined,
    name: '',
    phone: ''
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList()
})

//重置
const reset = () => {
  state.dataForm.no = ''
  state.dataForm.starttime = undefined
  state.dataForm.endtime = undefined
  state.dataForm.name = ''
  state.dataForm.phone = ''
  _table.search()
}

//打开订单详情弹出窗
const openDetail = row => {
  state.rowDetail = {}
  state.detailDialog = true
  state.rowDetail = row
}

//订单同意/拒绝退款
const refundClick = (row, agree) => {
  if (agree) {
    messageBox('确认同意退款？').then(async r => {
      if (!r) return
      _table.updateOther(`/admin/order/${row.id}/handle_refund`, {agree})
    })
  } else {
    ElMessageBox.prompt('请输入拒绝理由', '拒绝退款', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      _table.updateOther(`/admin/order/${row.id}/handle_refund`, {agree, disagree_reason: value})
    })
  }
}
</script>

<style scoped lang="less">
.goods {
  padding: 20px;
}
</style>