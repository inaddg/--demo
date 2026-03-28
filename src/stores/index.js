import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia
// 以前：
// import { useUserStore } from '@/stores/user'
// export { useUserStore }

// 现在：
export * from '@/stores/modules/user'
export * from '@/stores/modules/counter'
