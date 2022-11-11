import {reactive} from 'vue'
import myAxios from '@/request'
import {ElMessage} from "element-plus";
import {messageBox} from "@/utils/message.js";

function deepCopyParams(data, viewData) {
  if (!data || typeof data !== 'object') {
    return
  }
  // 获取对象上的键值数组并对它进行遍历
  Object.keys(data).forEach(key => {
    viewData[key] = data[key]
    // 判断如果当前的值还是对象的话，递归劫持
    if (typeof data[key] === 'object') {
      deepCopyParams(data[key], viewData[key])
    }
  })
}

class TableView {
  tableInfo = reactive({
    url: '',  //获取页面分页路由
    deleteUrl: '',  //删除路由
    addUrl: '', //新增路由
    updateUrl: '',  //修改路由
    loading: false, //确定按钮loading
    dataForm: {}, //高级搜索数据
    dataList: [], //获取到的分页数据
    ids: [],
    page: 1,
    isPage: true, //是否分页
    limit: 10,
    total: 0
  })

  constructor(viewParams) {
    deepCopyParams(viewParams, this.tableInfo)
  }

  //遍历清空数据
  clearObject(obj) {
    Object.keys(obj).forEach(item => {
      if (Array.isArray(this.tableInfo.dataForm[item])) {
        this.tableInfo.dataForm[item] = []
      } else {
        this.tableInfo.dataForm[item] = ''
      }
    })
  }

  getDataList = async () => {
    let res = await myAxios.get({
      url: this.tableInfo.isPage ? `${this.tableInfo.url}/${this.tableInfo.page}` : this.tableInfo.url,
      data: {limit: this.tableInfo.limit, ...this.tableInfo.dataForm}
    })
    if (res.code !== 200) {
      return ElMessage.error(res.msg + '!')
    }
    this.tableInfo.dataList = res.data.list ? res.data.list : res.data
    this.tableInfo.total = res.data.totalCount
    return new Promise(resolve => resolve(res))
  }

  //改变状态
  changeStatus = async (value, id = null) => {
    if (!id && this.tableInfo.ids.length === 0) return ElMessage.error('请先选择数据！')
    let res = !id
      ? await myAxios.post({url: `${this.tableInfo.url}/changestatus`, data: {ids: this.tableInfo.ids, status: value}})
      : Array.isArray(id)
        ? await myAxios.post({url: `${this.tableInfo.url}/changestatus`, data: {ids: id, status: value}})
        : await myAxios.post({url: `${this.tableInfo.url}/${id}/update_status`, data: {status: value}})
    if (res.code !== 200) {
      this.getDataList()
      return ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    }
    this.getDataList()
    ElMessage.success('状态更新成功~')
  }

  //新增或修改
  addOrUpdate = (formRef, formData, id) => {
    return new Promise(resolve => {
      formRef.validate(async isValid => {
        if (!isValid) {
          resolve(false)
          return
        }
        this.tableInfo.loading = true
        let res = id
          ? await myAxios.post({url: `${this.tableInfo.updateUrl}/${id}`, data: formData})
          : await myAxios.post({url: this.tableInfo.addUrl, data: formData})
        if (res.code !== 200) {
          this.tableInfo.loading = false
          ElMessage({
            message: res.msg + '!',
            type: 'error',
            dangerouslyUseHTMLString: true
          })
          resolve(false)
          return
        }
        this.tableInfo.loading = false
        ElMessage.success(id ? '修改成功~' : '新增成功~')
        this.getDataList()
        resolve(true)
      })
    })
  }

  // 分页, 当前页
  pageCurrentChangeHandle = (val) => {
    this.tableInfo.page = val
    this.getDataList()
  }

  //重置
  reset = () => {
    this.clearObject(this.tableInfo.dataForm)
    this.getDataList()
  }

  //搜索
  search = () => {
    this.tableInfo.page = 1
    this.getDataList()
  }

  //删除
  deleteHandle = async id => {
    if (!Array.isArray(id) && typeof id === "object" && this.tableInfo.ids.length === 0) return ElMessage.error('请先选择要删除的数据！')
    messageBox('确认删除？').then(async r => {
      if (!r) return
      let res = Array.isArray(id)
        ? await myAxios.post({url: `${this.tableInfo.deleteUrl}/delete_all`, data: {ids: id}})
        : typeof id === "object"
          ? await myAxios.post({url: `${this.tableInfo.deleteUrl}/delete_all`, data: {ids: this.tableInfo.ids}})
          : await myAxios.post({url: `${this.tableInfo.deleteUrl}/${id}/delete`})
      if (res.code !== 200) {
        return ElMessage({
          message: res.msg + '!',
          type: 'error',
          dangerouslyUseHTMLString: true
        })
      }
      ElMessage.success('删除成功~')
      this.getDataList()
    })
  }

  //多选
  selectHandel = selection => {
    this.tableInfo.ids = selection.map(item => item.id)
  }

  //获取其他信息
  getOtherInfo = async (url) => {
    let res = await myAxios.get({
      url: url,
      data: {limit: 9999}
    })
    if (res.code !== 200) {
      this.getDataList()
      return ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    }
    return new Promise(resolve => resolve(res))
  }

  //修改其他信息
  updateOther = (url, data) => {
    return new Promise(async resolve => {
      this.tableInfo.loading = true
      let res = await myAxios.post({url, data})
      if (res.code !== 200) {
        this.tableInfo.loading = false
        ElMessage({
          message: res.msg + '!',
          type: 'error',
          dangerouslyUseHTMLString: true
        })
        resolve(false)
        return
      }
      this.tableInfo.loading = false
      ElMessage.success('操作成功~')
      this.getDataList()
      resolve(true)
    })
  }
}

export default TableView
