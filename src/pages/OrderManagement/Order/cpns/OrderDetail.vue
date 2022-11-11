<template>
  <el-dialog :model-value="props.modelValue" v-if="props.rowDetail" title="订单详情" custom-class="custom-dialog" draggable
             @close="cancel">
    <el-card class="card">
      <template #header>
        <div class="card-header">订单信息</div>
      </template>
      <div class="card-line"><span>订单号：</span>{{ props.rowDetail.no }}</div>
      <div class="card-line">
        <span>付款方式：</span>{{
          props.rowDetail.payment_method === 'alipay' ? '支付宝支付' : props.rowDetail.payment_method === 'wechat' ? '微信支付' : '未支付'
        }}
      </div>
      <div class="card-line">
        <span>付款时间：</span>{{ props.rowDetail.paid_time ? filterTime(props.rowDetail.paid_time) : '' }}
      </div>
      <div class="card-line"><span>创建时间：</span>{{ props.rowDetail.create_time }}</div>
    </el-card>

    <el-card class="card" v-if="props.rowDetail.order_items">
      <template #header>
        <div class="card-header">商品信息</div>
      </template>
      <div style="display: flex;margin-bottom: 10px" v-for="item in props.rowDetail.order_items" :key="item.id">
        <el-image :src="item.goods_item?.cover" fit="cover" style="width: 60px;height: 60px;border-radius: 5px"/>
        <div style="padding-left: 10px;line-height: 20px;color: #929292;font-size: 12px">
          <div style="color: #000000;font-weight: bold">{{ item.goods_item?.title }}</div>
          <div v-if="item.goods_skus">
            <span v-for="i in item.goods_skus.skus">{{ `${i.name}: ${i.value}` }}&ensp;&ensp;</span>
          </div>
          <div>
            <span style="color: #e03e2d;font-weight: bold">￥{{ item.price }}</span> x
            <span>{{ item.num }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="card" v-if="props.rowDetail.address">
      <template #header>
        <div class="card-header">收货信息</div>
      </template>
      <div class="card-line"><span>收货人：</span>{{ props.rowDetail.address.name }}</div>
      <div class="card-line"><span>联系方式：</span>{{ props.rowDetail.address.phone }}</div>
      <div class="card-line"><span>收货地址：</span>{{
          `${props.rowDetail.address.province} ${props.rowDetail.address.city} ${props.rowDetail.address.district}`
        }}
      </div>
      <div class="card-line"><span>详细地址：</span>{{ props.rowDetail.address.address }}</div>
      <div class="card-line"><span>邮政编码：</span>{{ props.rowDetail.address.zip }}</div>
    </el-card>

    <el-card class="card" v-if="props.rowDetail.ship_data">
      <template #header>
        <div class="card-header">发货信息</div>
      </template>
      <div class="card-line" style="display: flex;justify-content: space-between">
        <div><span>物流公司：</span>{{ props.rowDetail.ship_data.express_company }}</div>
        <el-button type="text" @click="shipClick">查看物流</el-button>
      </div>
      <div class="card-line"><span>运单号：</span>{{ props.rowDetail.ship_data.express_no }}</div>
      <div class="card-line"><span>发货时间：</span>{{ filterTime(props.rowDetail.ship_data.express_time) }}</div>
    </el-card>

    <el-card class="card" v-if="props.rowDetail.refund_status !== 'pending'">
      <template #header>
        <div class="card-header" style="display: flex;justify-content: space-between">
          <span>退货信息</span>
          <el-tag style="font-weight: normal" effect="plain"
                  v-if="['applied', 'processing'].includes(props.rowDetail.refund_status)">退款中
          </el-tag>
          <el-tag style="font-weight: normal" effect="plain" type="success"
                  v-if="props.rowDetail.refund_status === 'success'">退款成功
          </el-tag>
          <el-tag style="font-weight: normal" effect="plain" type="danger"
                  v-if="props.rowDetail.refund_status === 'failed'">退款失败
          </el-tag>
        </div>
      </template>
      <div class="card-line"><span>退货理由：</span>{{ props.rowDetail.extra.refund_reason }}</div>
    </el-card>
    <template #footer>
      <el-button @click="cancel">关闭</el-button>
    </template>
  </el-dialog>

  <!--  抽屉-->
  <FormDrawer v-model="visiable" title="物流信息" close-on-click-modal :show-btn="false">
    <div style="display: flex;padding-bottom: 10px">
      <el-image :src="shipInfo.logo" fit="cover" style="width: 70px;height: 70px;border-radius: 2px;border: 1px solid #eeeeee"/>
      <div style="padding-left: 10px;line-height: 35px;font-size: 14px">
        <div>物流公司：{{ shipInfo.typename }}</div>
        <div>物流单号：{{ shipInfo.number }}</div>
      </div>
    </div>
    <el-divider/>
    <el-timeline>
      <el-timeline-item
          v-for="(item, index) in shipInfo.list"
          :key="index"
          :timestamp="item.status"
          :color="index === 0 ? '#409eff' : ''"
      >
        {{ item.time }}
      </el-timeline-item>
    </el-timeline>
  </FormDrawer>
</template>

<script setup>
import {defineEmits, defineProps, ref} from 'vue'
import {filterTime} from "@/utils/util.js";
import {getShip} from "@/request/api/OrderManagement.js";
import {ElMessage} from "element-plus";
import FormDrawer from '@/components/FormDrawer.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  rowDetail: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue'])
const visiable = ref(false)
const shipInfo = ref({})

//获取物流信息并展示
const shipClick = async () => {
  shipInfo.value = {}
  let res = await getShip(props.rowDetail.id)
  if (res.code !== 200) {
    return ElMessage.error(res.msg + '!')
  }
  if (res.data.result.number) {
    shipInfo.value = res.data.result
    visiable.value = true
  } else {
    ElMessage.error(res.data.msg + '!')
  }
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