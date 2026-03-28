<script setup>
// 导入中文包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

</script>

<template>
  <div>
    <!-- 全局组件都是中文显示 -->
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>

  </div>
</template>

<style scoped></style>
