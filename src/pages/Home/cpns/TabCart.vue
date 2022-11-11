<template>
  <el-row :gutter="20" class="mt-5">
    <el-col :span="3" v-for="item in iconNavs" :key="item.path" @click="toPath(item.path)">
      <el-card shadow="hover" style="cursor: pointer">
        <div class="cart-nav">
          <el-icon :size="25" :class="item.color">
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()
const iconNavs = [
  {
    icon: "user",
    color: "text-light-blue-500",
    title: "用户",
    path: "/user/list"
  },
  {
    icon: "shopping-cart",
    color: "text-violet-500",
    title: "商品",
    path: "/goods/list"
  },
  {
    icon: "tickets",
    color: "text-fuchsia-500",
    title: "订单",
    path: "/order/list"
  },
  {
    icon: "chat-dot-square",
    color: "text-teal-500",
    title: "评价",
    path: "/comment/list"
  },
  {
    icon: "picture",
    color: "text-rose-500",
    title: "图库",
    path: "/image/list"
  },
  {
    icon: "bell",
    color: "text-green-500",
    title: "公告",
    path: "/notice/list"
  },
  {
    icon: "set-up",
    color: "text-grey-500",
    title: "配置",
    path: "/setting/base"
  },
  {
    icon: "files",
    color: "text-yellow-500",
    title: "优惠券",
    path: "/coupon/list"
  }
]

const toPath = (path) => {
  router.push(path)
}
</script>

<style scoped lang="less">
.cart-nav {
@apply flex flex-col items-center justify-center;
}
</style>