import { dayjs } from 'element-plus'

// 日期函数的封装
export const formatTime = (time) => dayjs(time).format('YYYY年MM月DD日') // 格式化时间
