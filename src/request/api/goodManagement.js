import myAxios from '../index'

//修改商品详情
export const updateGoodsDetail = (data) => {
  return myAxios.post({
    url: `/admin/goods/${data.id}`,
    data: {content: data.content}
  })
}

//修改商品规格
export const updateGoodsSku = (data) => {
  return myAxios.post({
    url: `/admin/goods/updateskus/${data.id}`,
    data: data
  })
}

//添加商品多规格
export const addGoodsMoreSku = (data) => {
  return myAxios.post({
    url: `/admin/goods_skus_card`,
    data: data
  })
}

//修改商品多规格
export const updateGoodsMoreSkuName = (data) => {
  return myAxios.post({
    url: `/admin/goods_skus_card/${data.id}`,
    data: data
  })
}

//删除多规格
export const deleteGoodsMoreSku = (id) => {
  return myAxios.post({
    url: `/admin/goods_skus_card/${id}/delete`
  })
}

//规格排序
export const sortGoodsMoreSku = (data) => {
  return myAxios.post({
    url: `/admin/goods_skus_card/sort`,
    data
  })
}

//创建多规格值
export const createGoodsMoreSkuValue = (data) => {
  return myAxios.post({
    url: `/admin/goods_skus_card_value`,
    data
  })
}

//删除多规格值
export const deleteGoodsMoreSkuValue = (id) => {
  return myAxios.post({
    url: `/admin/goods_skus_card_value/${id}/delete`
  })
}

//获取规格列表
export const getSkuList = () => {
  return myAxios.get({
    url: `/admin/skus/1`,
    data: {limit: 9999}
  })
}

//分类推荐商品删除行
export const deleteCategoryRow = (id) => {
  return myAxios.post({
    url: `/admin/app_category_item/${id}/delete`
  })
}

//分类推荐商品关联添加
export const addCategoryGoods = (data) => {
  return myAxios.post({
    url: `/admin/app_category_item`,
    data
  })
}
