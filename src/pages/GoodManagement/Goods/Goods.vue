<template>
  <div class="goods">
    <el-tabs v-model="state.dataForm.tab" @tab-change="_table.getDataList">
      <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabs" :key="item.name"/>
    </el-tabs>

    <Search v-model="tableHeight" @reset="reset" @search="_table.search" @refresh="_table.getDataList" :subtract-height="54">
      <template #search>
        <el-form-item label="商品名称：">
          <el-input placeholder="请输入" v-model="state.dataForm.title" clearable/>
        </el-form-item>
        <el-form-item label="商品分类：">
          <el-select v-model="state.dataForm.category_id" placeholder="请选择" filterable clearable>
            <el-option v-for="item in state.cates" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
      </template>

      <template #button>
        <el-button type="primary" @click="openDrawer">新增</el-button>
        <el-button type="danger" @click="_table.deleteHandle" v-if="state.dataForm.tab !== 'delete'">批量删除
        </el-button>
        <el-button type="success" @click="_table.changeStatus(1)" plain
                   v-if="['all','off'].includes(state.dataForm.tab)">上架
        </el-button>
        <el-button type="warning" @click="_table.changeStatus(0)" plain
                   v-if="['all','saling'].includes(state.dataForm.tab)">下架
        </el-button>
        <el-button type="success" v-if="['delete'].includes(state.dataForm.tab)"
                   @click="changeGoods('恢复', '/admin/goods/restore')">恢复商品
        </el-button>
        <el-button type="warning" v-if="['delete'].includes(state.dataForm.tab)"
                   @click="changeGoods('彻底删除', '/admin/goods/destroy')">彻底删除
        </el-button>
      </template>

      <template #table>
        <el-table :height="tableHeight" border :data="_table.tableInfo.dataList" style="width: 100%"
                  @selection-change="_table.selectHandel" @cell-dblclick="editDrawer">
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
          <el-table-column prop="status" label="商品状态" header-align="center" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === 1" type="success" effect="plain" round>已上架</el-tag>
              <el-tag v-else type="warning" effect="plain" round>已下架</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="审核状态" header-align="center" align="center" width="160"
                           v-if="state.dataForm.tab !== 'delete'">
            <template #default="{ row }">
              <div v-if="row.ischeck === 0">
                <el-button type="primary" plain>审核通过</el-button>
                <el-button style="margin: 10px 0 0 0" plain type="danger">审核拒绝</el-button>
              </div>
              <el-tag v-if="row.ischeck === 1" effect="plain" round>通过</el-tag>
              <el-tag v-if="row.ischeck === 2" type="danger" effect="plain" round>未通过</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="总库存" header-align="center" align="center"/>
          <el-table-column label="操作" fixed="right" width="150px" header-align="center" align="center"
                           v-if="state.dataForm.tab !== 'delete'">
            <template #default="{ row }">
              <el-button type="text" @click="editDrawer(row)">修改</el-button>
              <el-button type="text" @click="openSkuDialog(row)">商品规格</el-button>
              <el-button type="text" @click="editBannerDrawer(row)">商品轮播图</el-button>
              <el-button type="text" @click="openDetailDialog(row)">商品详情</el-button>
              <el-button type="text" style="color: #f46c6c" @click="_table.deleteHandle([row.id])">删除</el-button>
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

  <!--  抽屉-->
  <FormDrawer v-model="state.drawer" :title="state.title" :loading="_table.tableInfo.loading"
              @handleClose="drawerClose" @onSubmit="drawerSubmit">
    <el-form ref="formRef" :model="state.formData" :rules="state.rules" label-width="120px">
      <el-form-item prop="title" label="商品名称：">
        <el-input v-model.trim="state.formData.title" placeholder="请输入" maxlength="50" style="width: 200px"
                  clearable/>
      </el-form-item>
      <el-form-item prop="category_id" label="分类：">
        <el-select v-model="state.formData.category_id" placeholder="请选择" style="width: 200px" filterable clearable>
          <el-option
              v-for="item in state.cates"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="cover" label="商品图片：">
        <ImageSelect v-model="state.formData.cover"/>
      </el-form-item>
      <el-form-item prop="unit" label="商品单位：">
        <el-input v-model="state.formData.unit" placeholder="请输入" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item prop="stock" label="总库存：">
        <el-input-number min="0" precision="0" v-model="state.formData.stock" style="width: 200px"
                         placeholder="请输入" clearable/>
      </el-form-item>
      <el-form-item prop="min_stock" label="库存预警：">
        <el-input-number min="0" precision="0" v-model="state.formData.min_stock" placeholder="请输入"
                         style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item prop="min_price" label="最低销售价：">
        <el-input-number :controls="false" min="0" precision="2" v-model="state.formData.min_price" placeholder="请输入"
                         style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item prop="min_oprice" label="最低销原价：">
        <el-input-number :controls="false" min="0" precision="2" v-model="state.formData.min_oprice"
                         placeholder="请输入" style="width: 200px" clearable/>
      </el-form-item>
      <el-form-item prop="stock_display" label="库存显示：">
        <el-radio-group v-model="state.formData.stock_display">
          <el-radio :label="1" border>显示</el-radio>
          <el-radio :label="0" border>隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="desc" label="商品描述：">
        <el-input type="textarea" placeholder="请输入" v-model="state.formData.desc"
                  maxlength="200" show-word-limit :rows="5" input-style="width: 280px" clearable/>
      </el-form-item>
      <el-form-item prop="status" label="是否上架：">
        <el-switch v-model="state.formData.status" :active-value="1" :inactive-value="0"/>
      </el-form-item>
    </el-form>
  </FormDrawer>

  <!--  轮播图-->
  <FormDrawer width="40%" v-model="state.bannerDrawer" title="选择轮播图" @handleClose="bannerDrawerClose"
              @onSubmit="bannerDrawerSubmit" :loading="_table.tableInfo.loading" close-on-click-modal>
    <ImageSelect v-model="state.bannerList" multiple/>
  </FormDrawer>

  <!--  商品详情弹窗-->
  <GoodsDetail v-model="state.detailDialog" :detail="state.detail" @refresh="_table.getDataList"/>

  <!--  商品规格弹窗-->
  <GoodsSku v-model="state.skuDialog" :sku-obj="state.skuObj" @refresh="_table.getDataList"/>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer.vue'
import Search from '@/components/Search.vue'
import {nextTick, onMounted, reactive, ref} from "vue";
import TableView from "@/utils/useView.js";
import ImageSelect from '@/components/ImageSelect.vue'
import GoodsDetail from '@/pages/GoodManagement/Goods/cpns/GoodsDetail.vue'
import GoodsSku from '@/pages/GoodManagement/Goods/cpns/GoodsSku.vue'
import {messageBox} from "@/utils/message.js";
import {ElMessage} from "element-plus";

const tabs = ref([
  {label: '全部', name: 'all'},
  {label: '审核中', name: 'checking'},
  {label: '出售中', name: 'saling'},
  {label: '已下架', name: 'off'},
  {label: '库存预警', name: 'min_stock'},
  {label: '回收站', name: 'delete'},
])
const formRef = ref()
const tableHeight = ref()
const state = reactive({
  url: '/admin/goods',
  deleteUrl: '/admin/goods',
  addUrl: '/admin/goods',
  updateUrl: '/admin/goods',
  cates: [],
  title: '', //抽屉标题
  id: null, //修改的数据id
  drawer: false,  //抽屉显示隐藏
  bannerDrawer: false,  //轮播图抽屉
  bannerList: [],  //轮播图列表
  detailDialog: false, //商品详情弹窗
  detail: {}, //点击的商品详情
  skuDialog: false, //商品详情弹窗
  skuObj: {}, //点击的商品详情
  dataForm: { //搜索数据
    title: '',
    tab: 'all',
    category_id: null
  },
  formData: { //新增修改数据
    title: '',        //商品名称
    category_id: '',  //商品分类
    cover: [],        //商品封面
    desc: '',         //商品描述
    unit: '',         //商品单位
    stock: 100,       //总库存
    min_stock: 10,    //库存预警
    status: 1,        //是否上架
    stock_display: 1, //是否显示
    min_price: 1,     //最低销售价
    min_oprice: 0,   //最低原价
    order: 0
  },
  rules: {
    title: {required: true, message: '请输入必填项', trigger: 'blur'},
    category_id: {required: true, message: '请选择必填项', trigger: 'blur'},
    unit: {required: true, message: '请选择必填项', trigger: 'blur'},
    stock: {required: true, message: '请输入必填项', trigger: 'blur'},
    min_stock: {required: true, message: '请输入必填项', trigger: 'blur'},
    min_price: {required: true, message: '请输入必填项', trigger: 'blur'},
    min_oprice: {required: true, message: '请输入必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList().then(res => {
    state.cates = res.data.cates
  })
})

//重置
const reset = () => {
  state.dataForm.title = ''
  state.dataForm.category_id = null
  _table.search()
}

//修改轮播图
const editBannerDrawer = row => {
  state.id = row.id
  state.bannerList = row.goods_banner?.map(item => {
    return item.url
  })
  state.bannerDrawer = true
}

//关闭轮播图抽屉
const bannerDrawerClose = () => {
  state.id = null
  state.bannerList = []
  state.bannerDrawer = false
}

//打开商品详情弹窗
const openDetailDialog = row => {
  state.detail = {}
  nextTick(() => {
    state.detail = {content: row.content, id: row.id}
    state.detailDialog = true
  })
}

//打开sku弹窗
const openSkuDialog = row => {
  state.skuObj = {}
  console.log(row)
  nextTick(() => {
    state.skuObj = {
      id: row.id,
      skuType: row.sku_type,
      skuValue: row.sku_value,
      goodsSkusCard: row.goods_skus_card,
      goodsSkusTable: row.goods_skus
    }
    state.skuDialog = true
  })
}

//新增
const openDrawer = () => {
  state.title = '新增商品'
  state.formData.order = _table.tableInfo.dataList[0].order + 1 || 0
  state.drawer = true
}

//修改
const editDrawer = (row) => {
  state.title = '修改商品'
  state.id = row.id
  state.formData.title = row.title
  state.formData.category_id = row.category_id
  state.formData.cover = [row.cover]
  state.formData.desc = row.desc
  state.formData.unit = row.unit
  state.formData.stock = row.stock
  state.formData.min_stock = row.min_stock
  state.formData.status = row.status
  state.formData.stock_display = row.stock_display
  state.formData.min_price = row.min_price
  state.formData.min_oprice = row.min_oprice
  state.drawer = true
}

//关闭右侧抽屉
const drawerClose = () => {
  formRef.value.resetFields()
  state.drawer = false
  state.title = ''
  state.id = null
  state.formData.title = ''
  state.formData.category_id = ''
  state.formData.cover = []
  state.formData.desc = ''
  state.formData.unit = ''
  state.formData.stock = 100
  state.formData.min_stock = 10
  state.formData.status = 1
  state.formData.stock_display = 1
  state.formData.min_price = 1
  state.formData.min_oprice = 0
  state.formData.order = 0
}

//提交
const drawerSubmit = () => {
  _table.addOrUpdate(formRef.value, {...state.formData, cover: state.formData.cover[0]}, state.id).then(res => {
    if (res) drawerClose()
  })
}

//提交轮播图
const bannerDrawerSubmit = () => {
  _table.updateOther(`/admin/goods/banners/${state.id}`, {banners: state.bannerList}).then(res => {
    if (res) bannerDrawerClose()
  })
}

//批量恢复和批量彻底删除商品
const changeGoods = (message, url) => {
  let ids = _table.tableInfo.ids
  if (ids.length === 0) return ElMessage.error(`请先选择要${message}的商品！`)
  messageBox(`确认${message}？`).then(async r => {
    if (!r) return
    _table.updateOther(url, {ids})
  })
}

</script>

<style scoped lang="less">
.goods {
  padding: 20px;
}
</style>