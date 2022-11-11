<template>
  <div class="comment">
    <Search v-model="tableHeight" @reset="_table.reset" @search="_table.search" @refresh="_table.getDataList">
      <template #search>
        <el-form-item label="商品名称：">
          <el-input placeholder="请输入" v-model="state.dataForm.title" clearable style="width: 200px;"/>
        </el-form-item>
      </template>

      <template #button/>

      <template #table>
        <el-table :height="tableHeight" border :data="_table.tableInfo.dataList" style="width: 100%">
          <el-table-column type="expand" width="50">
            <template #default="{ row }">
              <div class="comment-info">
                <el-image class="com-avatar" :src="row.avatar" fit="cover"/>
                <div class="com-main">
                  <div class="font-height">{{ row.user?.username }} <span style="color: #8A8A8CFF">{{
                      row.create_time
                    }}</span></div>
                  <div class="font-height">{{ row.review?.data }}</div>
                  <el-image v-for="(item,index) in row.review?.image" :src="item" :key="index" fit="cover"
                            class="com-img"/>
                  <div class="com-review" v-if="row.extra?.length > 0">
                    <div style="display: flex;justify-content: space-between" v-for="(re, indey) in row.extra"
                         :key="indey">
                      <div>
                        <div class="font-height" style="font-weight: bold">客服</div>
                        <div class="font-height">{{ re.data }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <el-button type="text" @click="openDialog(row, row.extra?.length === 0 ? 'review' : 'change')">
                  {{ row.extra?.length === 0 ? '回复' : '修改' }}
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="80" align="center" header-align="center"/>
          <el-table-column prop="title" label="商品" width="300px">
            <template #default="{ row }">
              <div style="display: flex;padding: 5px;width: 280px">
                <el-image :src="row.goods_item?.cover" fit="cover"
                          style="width: 60px;height: 60px;border-radius: 10px"/>
                <div class="text-ellipsis"
                     style="padding-left: 10px;line-height: 60px;color: #000000;font-size: 16px;font-weight: bold;width: 200px">
                  {{ row.goods_item?.title }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sale_count" label="评价信息" header-align="center" align="center" min-width="150">
            <template #default="{ row }">
              <div>用户：{{ row.user?.username }}</div>
              <el-rate :model-value="row.rating" size="large" disabled/>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="评价时间" header-align="center" align="center" min-width="180"/>
          <el-table-column prop="status" label="是否显示" header-align="center" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                         @change="(value) => _table.changeStatus(value, row.id)" :disabled="row.super === 1"/>
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

    <!--    修改回复评价-->
    <el-dialog v-model="state.dialogVisible" :title="state.title" width="30%" draggable>
      <el-form v-if="state.dialogVisible" ref="formRef" :model="state.formData" :rules="state.rules">
        <el-form-item prop="comment" label="评论内容">
          <el-input type="textarea" v-model="state.formData.comment" rows="5" maxlength="225" show-word-limit
                    placeholder="请输入"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="state.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Search from '@/components/Search.vue'
import {onMounted, reactive, ref} from "vue";
import TableView from "@/utils/useView.js";

const formRef = ref()
const tableHeight = ref()
const state = reactive({
  url: '/admin/goods_comment',
  deleteUrl: '/admin/goods_comment',
  addUrl: '/admin/goods_comment',
  updateUrl: '/admin/goods_comment',
  dialogVisible: false,
  id: null,
  title: '',
  dataForm: { //搜索数据
    title: ''
  },
  formData: {
    comment: ''
  },
  rules: {
    comment: {required: true, message: '请选择必填项', trigger: 'blur'}
  }
})

let _table = new TableView(state)

onMounted(() => {
  _table.getDataList()
})

//打开回复评论弹窗
const openDialog = (row, type) => {
  state.id = row.id
  state.title = '回复评论'
  type === 'review' ? state.formData.comment = '' : state.formData.comment = row.extra[0].data
  state.dialogVisible = true
}

//回复评论
const submit = () => {
  formRef.value.validate(isValid => {
    if (!isValid) return
    _table.updateOther(`/admin/goods_comment/review/${state.id}`, {data: state.formData.comment}).then(res => {
      if (res) {
        state.dialogVisible = false
      }
    })
  })
}
</script>

<style scoped lang="less">
.comment {
  padding: 20px;
  .comment-info {
    display: flex;
    padding: 10px 50px;
    .com-avatar {
      width: 50px;
      height: 50px;
      border-radius: 25px;
    }
    .com-main {
      padding-left: 20px;
      width: calc(100% - 80px);
      .font-height {
        line-height: 25px;
        word-wrap: break-word;
      }
      .com-img {
        width: 100px;
        height: 100px;
        border-radius: 5px;
        margin: 10px 10px 0 0;
      }
      .com-review {
        width: 100%;
        min-height: 60px;
        background-color: #f2f4f7;
        border-radius: 5px;
        margin-top: 20px;
        padding: 10px 10px;
      }
    }
  }
}
</style>