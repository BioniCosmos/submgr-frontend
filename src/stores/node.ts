import type { Node } from '@/views/NodeView.vue'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useNodeStore = defineStore('node', () => {
  const node: Node = reactive({
    name: '',
    apiAddress: '',
    apiPort: 0,
  })
  const isToInsertNode = ref(true)
  return { node, isToInsertNode }
})