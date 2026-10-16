import { definePlugin, PluginContext } from '../../../src/index'

/**
 * Antigravity Autonomous Agent (agy) Built-in Plugin for Makarya IDE
 */
export const AntigravityAgentPlugin = definePlugin({
  manifest: {
    id: 'makarya.builtin.agent-antigravity',
    name: 'Antigravity CLI Agent (agy)',
    version: '1.0.0',
    description:
      'Agen pemrograman otonom bertenaga Antigravity CLI (agy) dari Google Deepmind. Mendukung penalaran mendalam (deep reasoning), eksekusi tools otomatis, auto-diff review, dan klarifikasi interaktif.',
    author: 'Makarya AI Lab / Google Deepmind',
    icon: 'i-lucide-sparkles',
    category: 'ai',
    enabledByDefault: true,
    contributes: {
      sidebarViews: [
        {
          id: 'antigravity-panel',
          title: 'Antigravity (agy)',
          icon: 'i-lucide-sparkles',
          order: 10
        }
      ],
      commands: [
        {
          id: 'antigravity.togglePanel',
          title: 'Antigravity: Buka / Tutup Panel Agent (agy)',
          category: 'Antigravity Agent',
          icon: 'i-lucide-sparkles',
          shortcut: 'Ctrl+Shift+A'
        },
        {
          id: 'antigravity.newSession',
          title: 'Antigravity: Mulai Sesi Percakapan Baru',
          category: 'Antigravity Agent',
          icon: 'i-lucide-plus'
        },
        {
          id: 'antigravity.openHistory',
          title: 'Antigravity: Buka Riwayat Percakapan (Brain History)',
          category: 'Antigravity Agent',
          icon: 'i-lucide-history'
        },
        {
          id: 'antigravity.selectModel',
          title: 'Antigravity: Pilih Model AI Antigravity',
          category: 'Antigravity Agent',
          icon: 'i-lucide-cpu'
        }
      ],
      statusBarItems: [
        {
          id: 'antigravity.status',
          text: 'Antigravity: Siap',
          icon: 'i-lucide-sparkles',
          tooltip: 'Klik untuk membuka / menutup Antigravity CLI Agent',
          command: 'antigravity.togglePanel',
          alignment: 'right'
        }
      ]
    }
  },

  activate(context: PluginContext) {
    // 1. Command: Toggle Panel
    context.subscriptions.push(
      context.commands.registerCommand('antigravity.togglePanel', () => {
        window.dispatchEvent(new CustomEvent('makarya:toggle-antigravity-panel'))
      })
    )

    // 2. Command: New Session
    context.subscriptions.push(
      context.commands.registerCommand('antigravity.newSession', () => {
        window.dispatchEvent(new CustomEvent('makarya:antigravity-new-session'))
      })
    )

    // 3. Command: Open History
    context.subscriptions.push(
      context.commands.registerCommand('antigravity.openHistory', () => {
        window.dispatchEvent(new CustomEvent('makarya:antigravity-open-history'))
      })
    )

    // 4. Command: Select Model
    context.subscriptions.push(
      context.commands.registerCommand('antigravity.selectModel', () => {
        window.dispatchEvent(new CustomEvent('makarya:antigravity-select-model'))
      })
    )

    // Notify window that Antigravity plugin is active
    window.dispatchEvent(new CustomEvent('makarya:antigravity-plugin-state', { detail: { enabled: true } }))
  },

  deactivate() {
    // Notify window that Antigravity plugin is inactive
    window.dispatchEvent(new CustomEvent('makarya:antigravity-plugin-state', { detail: { enabled: false } }))
  }
})

// Export UI Components
export { default as AntigravityPanel } from './components/AntigravityPanel.vue'
export { default as AntigravityModelModal } from './components/AntigravityModelModal.vue'
export { default as AntigravitySessionModal } from './components/AntigravitySessionModal.vue'

// Export Store & Types
export {
  useAntigravityStore,
  DEFAULT_ANTIGRAVITY_MODELS,
  type AntigravityModelItem,
  type AntigravitySessionItem,
  type AntigravityMessage,
  type AntigravityToolCall,
  type AntigravityQuestion
} from './stores/antigravityStore'

// Export Assets
export { default as antigravityLogo } from './assets/antigravity-logo.svg'

export default AntigravityAgentPlugin
