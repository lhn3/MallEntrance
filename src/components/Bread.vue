<template>
  <div class="f-bread" :style="{left: !$store.state.isFoldMenu ? '250px' : '64px'}">
    <el-tabs
        v-model="activeTab"
        type="card"
        @tab-remove="removeTab"
        style="min-width: 1px;padding: 0 10px"
        @tab-change="handelClick"
    >
      <el-tab-pane
          v-for="item in tabsList"
          :key="item.path"
          :closable="item.path !== '/'"
          :label="item.title"
          :name="item.path"
      />
    </el-tabs>
    <el-dropdown class="dropdown">
      <span class="el-dropdown-link" style="cursor: pointer">
        <el-icon><arrow-down/></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="closeOther">关闭其他</el-dropdown-item>
          <el-dropdown-item @click="closeAll">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

</template>

<script setup>

import {ref} from 'vue'
import {useRoute, useRouter, onBeforeRouteUpdate} from "vue-router";
import {useCookies} from '@vueuse/integrations/useCookies'

let route = useRoute()
let router = useRouter()
const cookies = useCookies()
const activeTab = ref(route.path)
const tabsList = ref([
  {
    title: '主控台',
    path: '/'
  }
])

tabsList.value = cookies.get('disha-bread') || tabsList.value

//点击标签
const handelClick = (name) => {
  router.push(name)
}

//监听路由变化新增或是切换tab
onBeforeRouteUpdate((to) => {
  let res = tabsList.value.find(item => {
    return item.path === to.path
  })
  if (!res) {
    tabsList.value.push({
      title: to.meta.title,
      path: to.path
    })
    cookies.set('disha-bread', tabsList.value)
  }
  activeTab.value = to.path
})

//删除某个tab
const removeTab = (targetName) => {
  const tabs = tabsList.value
  let activeName = activeTab.value
  //如果删除的刚好是选中的路由
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.path === targetName) {
        //删除后选中下一个，没有下一个就选中上一个
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.path
          router.push(nextTab.path)
        }
      }
    })
  }
  activeTab.value = activeName
  tabsList.value = tabs.filter((tab) => tab.path !== targetName)
  cookies.set('disha-bread', tabsList.value)
}

//删除其他
const closeOther = () => {
  let res = tabsList.value.find(item => {
    return item.path === route.path
  })
  tabsList.value = [{
    title: '主控台',
    path: '/'
  }]
  if (res.path !== '/') tabsList.value.push(res)
  cookies.set('disha-bread', tabsList.value)
}

//删除全部
const closeAll = () => {
  tabsList.value = [{
    title: '主控台',
    path: '/'
  }]
  router.push('/')
  cookies.set('disha-bread', tabsList.value)
}
</script>

<style scoped lang="less">
.f-bread {
@apply fixed bg-gray-100 flex items-center px-2;
  top: 64px;
  right: 0;
  height: 44px;
  z-index: 9;
  transition: all 0.5s;

  .dropdown {
  @apply bg-white rounded ml-auto flex items-center justify-center px-2;
    height: 32px;
  }

  :deep(.el-tabs__header) {
  @apply mb-0;
    border: none;
  }

  :deep(.el-tabs__nav) {
    border: 0 !important;
  }

  :deep(.el-tabs__item) {
    border: 0 !important;
  @apply bg-white mx-1 rounded mt-1;
    height: 32px;
    line-height: 32px;
  }

  :deep(.is-disabled) {
    cursor: not-allowed;
  }

  :deep(.el-tabs__item:hover) {
    color: #42b983;
  }

  :deep(.is-active) {
    color: #42b983;
  }
}
</style>





















