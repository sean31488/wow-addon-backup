<template>
  <div class="tree-view">
    <ul v-for="item in items" :key="item.id" class="menu-list">
      <li>
        <a :class="{ 'is-active': item.id === activeItemId }" @click="itemOnClick(item)" @dblclick="fetchNode(item)">
          {{ item.isFold ? '+' : '-' }}<span class="pl-2">{{ item.name }}</span>
        </a>
      </li>
      <tree-view
        v-if="!item.isFold"
        :items="item.node"
        :active-item-id="activeItemId"
        class="pl-5"
        @google-drive-folder-on-change="$emit('google-drive-folder-on-change', $event)"></tree-view>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TreeView',
  props: {
    items: { required: true },
    activeItemId: { type: String, required: true }
  },
  computed: {
    ...mapState(['googleToken'])
  },
  methods: {
    fetchNode (item) {
      if (!item.node) {
        window.ipcRenderer.invoke('google.drive.get-files', {
          googleToken: this.googleToken,
          params: {
            q: `mimeType = 'application/vnd.google-apps.folder'
                and '${item.id}' in parents
                and trashed = false`
          }
        }).then(files => {
          item.node = files
        })
      }
      item.isFold = !item.isFold
    },
    itemOnClick (item) {
      this.$emit('google-drive-folder-on-change', {
        id: item.id,
        name: item.name
      })
    }
  }
}
</script>

<style lang="sass">
.tree-view
  user-select: none
  .active
    background: theme("colors.blue.400")
</style>
