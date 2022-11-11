<template>
  <div class="f-menu">
    <el-menu
        active-text-color="#ffa33f"
        background-color="#545c64"
        :default-active="$route.path === '/home' ? '/' : $route.path"
        class="menu"
        text-color="#fff"
        :collapse="$store.state.isFoldMenu"
        :collapse-transition="false"
        :unique-opened="true"
    >
      <template v-for="(item, index) in $store.state.manager.menus" :key="item.name">
        <el-sub-menu :index="index" v-if="item.child && item.child.length > 0">
          <template #title>
            <el-icon>
              <component :is="item.icon"/>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="i in item.child" :index="i.frontpath" :key="item.name" @click="toPatch(i.frontpath)">
            <el-icon>
              <component :is="i.icon"/>
            </el-icon>
            <template #title>{{ i.name }}</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item :index="item.frontpath" v-else @click="toPatch(item.frontpath)">
          <el-icon>
            <component :is="item.icon"/>
          </el-icon>
          <template #title>{{ item.name }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()
const toPatch = (path) => {
  router.push(path)
}
</script>

<style scoped lang="less">
.f-menu {
  width: 100%;
  height: calc(100vh - 60px);
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
@apply shadow-md fixd;

  .menu {
    border: none;
    height: 100%;
  }
}

.f-menu::-webkit-scrollbar {
  width: 0;
}

</style>