<template>
  <el-row :gutter="20" class="mt-5">
    <el-col :span="12" v-permission="['getStatistics3,GET']">
      <Cart title="订单统计">
        <template #header>
          <div style="display: flex">
            <el-check-tag v-for="item in state" class="tag" :checked="checked === item.value"
                          @change="onChange(item.value)" :key="item.value">
              {{ item.text }}
            </el-check-tag>
          </div>
        </template>
        <template #body>
          <div ref="echartsRef" id="echarts" style="width: 100%; height: 345px"/>
        </template>
      </Cart>
    </el-col>

    <el-col :span="12" v-permission="['getStatistics2,GET']">
      <Cart title="店铺及商品提示" tag-type="success" tag-info="店铺及商品提示" style="margin-bottom: 20px">
        <template #body>
          <el-row :gutter="20">
            <el-col :span="6" v-for="item in goods" :key="item.label">
              <el-card shadow="hover"
                       class="flex flex-col items-center justify-center text-center border-0 bg-light-400">
                <div class="text-2xl mb-2">{{ item.value }}</div>
                <div class="text-xl text-gray-500">{{ item.label }}</div>
              </el-card>
            </el-col>
          </el-row>
        </template>
      </Cart>

      <Cart title="交易提示" tag-type="danger" tag-info="需尽快处理">
        <template #body>
          <el-row :gutter="20">
            <el-col :span="6" v-for="item in order" :key="item.label">
              <el-card shadow="hover"
                       class="flex flex-col items-center justify-center text-center border-0 bg-light-400">
                <div class="text-2xl mb-2">{{ item.value }}</div>
                <div class="text-xl text-gray-500">{{ item.label }}</div>
              </el-card>
            </el-col>
          </el-row>
        </template>
      </Cart>
    </el-col>
  </el-row>
</template>

<script setup>
import {getHomeEcharts, getHomeOther} from "@/request/api/manager.js";
import {onMounted, ref, onBeforeUnmount} from "vue";
import {ElMessage} from "element-plus";
import * as echarts from 'echarts';
import {useResizeObserver} from '@vueuse/core'
import Cart from '@/components/Cart.vue'

const state = [
  {text: '近一个月', value: 'month'},
  {text: '近一周', value: 'week'},
  {text: '近24小时', value: 'hour'}
]

let myChart = null
const echartsRef = ref(null)
const checked = ref('week')
const goods = ref([])
const order = ref([])

onMounted(async () => {
  //声明注册
  const chartDom = document.getElementById('echarts');
  if (chartDom) {
    myChart = echarts.init(chartDom);
    getEchartsInfo('week')
  }
  getOtherInfo()
})

//请求echarts数据
const getEchartsInfo = async (type) => {
  myChart.showLoading()
  const res = await getHomeEcharts({type})
  if (res.code !== 200) {
    return ElMessage.error(res.msg + '!')
  }
  resetEcharts(res.data.x, res.data.y)
  myChart.hideLoading()
}

//请求其他数据
const getOtherInfo = async () => {
  const res = await getHomeOther()
  if (res.code !== 200) {
    return ElMessage.error(res.msg + '!')
  }
  goods.value = res.data.goods
  order.value = res.data.order
}

//重载echarts数据
const resetEcharts = (x, y) => {
  let option = {
    xAxis: {
      type: 'category',
      data: x.reverse()
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: y.reverse(),
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  }
  myChart.setOption(option)
}

//改变数据
const onChange = (type) => {
  if (checked.value === type) return
  checked.value = type
  getEchartsInfo(type)
}

//销毁echarts
onBeforeUnmount(() => {
  if (myChart) echarts.dispose(myChart)
})

//窗口改变大小时执行
useResizeObserver(echartsRef, () => myChart.resize())

</script>

<style scoped lang="less">
.tag {
  margin-right: 10px;
}
</style>