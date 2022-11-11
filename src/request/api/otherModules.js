import myAxios from '../index'

//获取图片分类标签列表
export const getImageClassify = (data) => {
  return myAxios.get({
    url: `/admin/image_class/${data.page}`,
    data: {limit: data.limit || 10}
  })
}

//新增分类标签
export const addClassify = (data) => {
  return myAxios.post({
    url: '/admin/image_class',
    data
  })
}

//修改分类标签
export const updateClassify = (data) => {
  return myAxios.post({
    url: `/admin/image_class/${data.id}`,
    data
  })
}

//删除分类标签
export const delClassify = (id) => {
  return myAxios.post({
    url: `/admin/image_class/${id}/delete`
  })
}

//获取指定分类下的图片列表
export const getImageList = (data) => {
  return myAxios.get({
    url: `/admin/image_class/${data.id}/image/${data.page}`,
    data: {limit: data.limit || 10}
  })
}

//图片重命名
export const renameImage = (data) => {
  return myAxios.post({
    url: `/admin/image/${data.id}`,
    data
  })
}

//删除图片
export const delImages = (data) => {
  return myAxios.post({
    url: '/admin/image/delete_all',
    data
  })
}
