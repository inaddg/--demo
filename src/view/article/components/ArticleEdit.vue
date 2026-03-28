<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { artEditService, artGetDetailService, artPublishService } from '@/api/article';
import { baseURL } from '@/utils/request';
import axios from 'axios'

const visibleDrawer = ref(false)

//默认数据
const defaultForm = {
  title: '',    // 标题
  cate_id: '',  // 分类id
  cover_img: '',// 封面图象 file对象
  content: '',  // string 内容
  state: ''     // 状态
}

// 准备表单数据
const formModel = ref({ ...defaultForm })

// 图片上传相关逻辑
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
  // console.log(uploadFile)
}

// 发布文章
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  formModel.value.state = state
  // console.log(formModel.value)

  // 注意：当前接口，需要的是 formData 对象
  // 将普通对象 => 转换成 => formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  // 调用接口发请求
  if (formModel.value.id) {
    // 编辑文章
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
 
    emit('success','edit')
  } else {
    // 添加文章
    await artPublishService(fd)
    ElMessage.success('发布成功')
    visibleDrawer.value = false

    emit('success','add')
  }
}

const editorRef = ref()
const open = async(row) => {
  visibleDrawer.value = true

  if (row.id) {
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    // 图片需要单独处理回显
    imgUrl.value = baseURL + formModel.value.cover_img

    const file = await urlToFile(
      imgUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    editorRef.value.setHTML('')
    // console.log('新增')
  }
  console.log(row)
}

async function urlToFile(imageUrl, fileName = 'image.png') {
  try {
    // 1. 用Axios请求图片（注意：responseType设为blob）
    const response = await axios.get(imageUrl, {
      responseType: 'blob' // 关键：指定响应类型为Blob
    });

    // 2. 将Blob转为File（File是Blob的子类）
    const file = new File([response.data], fileName, {
      type: response.data.type // 自动获取图片MIME类型（如image/png）
    });

    return file;
  } catch (error) {
    console.error('图片转File失败: ', error);
    return null;
  }
}

// 将方法暴露给父组件
defineExpose({
  open
})
</script>

<template>
  <!-- 抽屉 -->
  <el-drawer
    v-model="visibleDrawer"
    :title= "formModel.id ? '文章编辑' : '添加文章'"
    direction="rtl"
    size="50%">
    <!-- 发表文章表单 -->
    <el-form ref="formRef" :model="formModel" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
        v-model="formModel.cate_id"
        width="100%"
        ></channel-select>
      </el-form-item>

      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传，不需要配置 action 等参数
             只需要做前端的本地预览图片即可，无需在提交前上传图标
             本地预览语法：URL.createObjectURL(...) 创建本地预览的地址，来预览
        -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
          ref = "editorRef"
          v-model:content="formModel.content"
          content-type="html"
          theme="snow"></quill-editor>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
