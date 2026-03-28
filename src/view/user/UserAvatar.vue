<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user.js'

// 基于Store的数据，初始化imgURL的初值
const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref()

const onSelectFile = (file) => {
  // 方法1：基于 FileReader 读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
    // console.log(imgUrl.value)
  }
  // 方法2：imgUrl.value = URL.createObjectURL(file.raw)
}

const onUpdateAvatar = async() => {
  await userUpdateAvatarService(imgUrl.value)
  // userStore 用户信息更新
  await userStore.getUser()
  ElMessage.success('头像更新成功')
}
</script>

<template>
  <page-container title="更换头像">
    <el-upload
    ref="uploadRef"
    class="avatar-uploader"
    :show-file-list="false"
    :auto-upload="false"
    :on-change="onSelectFile"
    >
    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>

  <br>
  <el-button
  type="primary"
  @click="uploadRef.$el.querySelector('input').click()"
   :icon="Plus"
   size="large">选择图片</el-button
   >
  <el-button
  @click="onUpdateAvatar"
  type="success"
  :icon="Upload"
  size="large"
  >上传头像</el-button>
  </page-container>
</template>

<style scoped lang="scss">
// 上传容器整体样式（核心：1px虚线、圆角、正方形）
.avatar-uploader {
  // 穿透 Element UI 的上传框组件，修改其基础样式
  :deep(.el-upload) {
    width: 278px;
    height: 278px;
    border: 1px dashed #dcdfe6; // 默认灰色虚线
    border-radius: 8px; // 圆角（视觉更舒适）
    cursor: pointer; // 鼠标小手
    position: relative; // 用于内部图标/图片定位
    overflow: hidden; // 超出框的图片隐藏（满足要求4）
    transition: all 0.3s ease; // 过渡动画，hover效果更丝滑

    // 鼠标悬停效果（淡蓝色虚线）
    &:hover {
      border-color: #409eff; // Element UI 淡蓝色（柔和不刺眼）
      background-color: #f0f7ff; // 轻微淡蓝背景，hover反馈更明显
    }
  }

  // 已上传的头像样式
  .avatar {
    width: 100%; // 占满上传框
    height: 100%; // 占满上传框
    object-fit: cover; // 图片等比例缩放，填满框且不拉伸
    display: block; // 消除图片底部间隙
  }

  // 加号图标样式（居中显示）
  .avatar-uploader-icon {
    position: absolute; // 绝对定位，方便居中
    top: 50%; // 垂直居中（上移50%）
    left: 50%; // 水平居中（左移50%）
    transform: translate(-50%, -50%); // 精准居中（修正自身尺寸）
    font-size: 48px; // 加号大小（视觉协调）
    color: #8c939d; // 灰色图标（不突兀）
    transition: color 0.3s ease; // 图标颜色过渡

    // 鼠标悬停时图标也变蓝，整体风格统一
    .avatar-uploader:hover & {
      color: #409eff;
    }
  }
}

// 按钮样式优化（自行发挥：调整间距、hover效果增强）
.el-button {
  margin-right: 16px; // 按钮之间留间距，不拥挤
  padding: 12px 24px; // 加大按钮内边距，点击区域更广

  // 增强按钮hover反馈
  &:hover {
    transform: translateY(-2px); // 轻微上移，有立体感
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); // 轻微阴影，更突出
  }
}

// 页面整体布局优化（自行发挥：居中显示，增加上下间距）
page-container {
  display: flex;
  flex-direction: column;
  align-items: center; // 上传框和按钮整体水平居中
  padding: 40px 0; // 上下留空白，不贴边
}
</style>
