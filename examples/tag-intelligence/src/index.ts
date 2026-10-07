import { definePlugin, PluginContext } from '../../../src/index'

/**
 * Example Plugin: Tag Intelligence & Pair Sync
 */
export const TagIntelligencePlugin = definePlugin({
  manifest: {
    id: 'makarya.builtin.tag-intelligence',
    name: 'Tag Intelligence & Pair Sync',
    version: '1.0.0',
    description: 'Fitur penutupan tag otomatis (Auto Close Tag) dan penggantian nama pasangan tag (Auto Rename Tag) untuk berkas HTML, XML, dan Vue.',
    author: 'Makarya Core',
    icon: 'i-lucide-code-xml',
    category: 'editor',
    contributes: {
      commands: [
        {
          id: 'editor.toggleAutoTags',
          title: 'Tag Intelligence: Status Bantuan Tag',
          category: 'Editor',
          icon: 'i-lucide-code-xml'
        }
      ]
    }
  },

  activate(context: PluginContext) {
    context.subscriptions.push(
      context.commands.registerCommand('editor.toggleAutoTags', () => {
        context.ui.showToast({
          title: 'Tag Intelligence',
          message: 'Auto Close Tag & Auto Rename Tag aktif secara native pada Monaco Editor.',
          type: 'success'
        })
      })
    )
  }
})

export default TagIntelligencePlugin
