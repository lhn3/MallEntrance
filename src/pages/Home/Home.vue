<template>
  <el-container style="overflow: hidden;background-color: #f1f2f5">
    <el-header>
      <Header/>
    </el-header>
    <el-container>
      <el-aside class="aside" :width="!$store.state.isFoldMenu ? '250px' : '64px'">
        <Menu/>
      </el-aside>
      <el-main>
        <Bread/>
        <div class="main-view">
          <router-view v-slot="{ Component }">
            <keep-alive :max="5">
              <component :is="Component"/>
            </keep-alive>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import Bread from "@/components/Bread.vue";
</script>

<style scoped lang="less">
.aside {
  transition: all 0.5s;
}

.main-view {
  padding-top: 28px;
  width: 100%;
  height: calc(100vh - 60px - 44px);
  overflow: auto;
  overflow-x: hidden;
  background-color: white;
}

//.main-view::-webkit-scrollbar {
//  display: none;
//}
</style>