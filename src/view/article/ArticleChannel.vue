<script setup>
import { artDelChannelService, artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from '@/view/article/components/ChannelEdit.vue'

const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  // 获取文章分类列表
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  console.log(channelList.value);
  loading.value = false
}
getChannelList()

const onEditChannel = ( row, $index ) => {
  dialog.value.open(row)
}
const onDelChannel = async ( row ) => {
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}

const onAddChannel = () => {
  dialog.value.open({})
}

const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row, $index }">
          <el-button
          :icon="Edit"
          circle
          plain
          type="primary"
          size="small"
          @click="onEditChannel(row, $index)">
          </el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            size="small"
            type="danger"
            @click="onDelChannel(row, $index)">
          </el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <ChannelEdit ref="dialog" @success="onSuccess">
    </ChannelEdit>
  </page-container>
</template>

<style lang="scss" scoped>
</style>
