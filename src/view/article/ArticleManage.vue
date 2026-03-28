<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from '@/view/article/components/ChannelSelect.vue'
import { artGetListService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'

  const articleList = ref([])
  const total = ref(0)
  const loading = ref(false) // 控制表格加载状态

// 定义请求参数对象
  const params = ref({
  pagenum: 1,  // 当前页码
  pagesize: 5, // 每页显示的条数
  cate_id: '',
  state: ''
  })

// 基于params参数 ，获取文章列表
const getArticleList = async () => {
  loading.value = true
    const res = await artGetListService(params.value)
    articleList.value = res.data.data
    total.value = res.data.total
  loading.value = false
  }
  getArticleList()

  // 编辑
  const onEditArticle = (row) => {
    articleEditRef.value.open(row)
  }

  const articleEditRef = ref()
  // 添加
  const onAddArticle = () => {
    articleEditRef.value.open({})
  }

  // 删除
  const onDeleteArticle = (row) => {
    console.log(row)
  }

  // 处理分页逻辑
const onSizeChange = size => {
    params.value.pagenum = 1
    params.value.pagesize = size
    getArticleList()
  }
  const onCurrentChange = page => {
    params.value.pagenum = page
    getArticleList()
  }

// 搜索
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}

// 重置
const onReset = () => {
  params.value.pagenum = 1
  params.value.pagesize = 5
  params.value.cate_id = ''
  params.value.state = ''

  getArticleList()
}

// 添加/编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
    getArticleList()
  }
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <channel-select v-model="params.cate_id" style='width: 300px'></channel-select>
      </el-form-item>

      <el-form-item label="发布状态：">
         <el-select v-model="params.state" style='width: 300px'>
          <el-option label="已发布" vlue="已发布"></el-option>
          <el-option label="草稿" vlue="草稿"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="文章标题" width="180">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类" width="180"></el-table-column>
      <el-table-column prop="pub_date" label="发表时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作">

        <template #default="{ row }">
          <el-button
          circle plain
          type="primary"
          :icon="Edit"
          @click="onEditArticle(row)"
          size="small"></el-button>
          <el-button circle plain type="danger" :icon="Delete" @click="onDeleteArticle(row)" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
     <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout=" jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加编辑的抽屉 -->
    <article-edit
    ref="articleEditRef"
    @success="onSuccess"
    ></article-edit>
  </page-container>
</template>

<style lang="scss" scoped>
</style>
i
