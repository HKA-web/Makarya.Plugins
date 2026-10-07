import { definePlugin, PluginContext } from '../../../src/index'

export interface IconDefinition {
  icon: string
  colorClass: string
}

/**
 * Directory name mappings for Makarya Studio Palette
 */
const DIRECTORY_ICON_MAP: Record<string, IconDefinition> = {
  // Source & Core
  src: { icon: 'i-lucide-folder-code', colorClass: 'text-sky-400' },
  source: { icon: 'i-lucide-folder-code', colorClass: 'text-sky-400' },
  app: { icon: 'i-lucide-folder-code', colorClass: 'text-sky-400' },
  packages: { icon: 'i-lucide-folder-code', colorClass: 'text-sky-400' },
  core: { icon: 'i-lucide-folder-code', colorClass: 'text-sky-400' },

  // UI & Components
  components: { icon: 'i-lucide-folder-cog', colorClass: 'text-teal-400' },
  widgets: { icon: 'i-lucide-folder-cog', colorClass: 'text-teal-400' },
  ui: { icon: 'i-lucide-folder-cog', colorClass: 'text-teal-400' },
  elements: { icon: 'i-lucide-folder-cog', colorClass: 'text-teal-400' },

  // Views & Pages
  views: { icon: 'i-lucide-layout', colorClass: 'text-purple-400' },
  pages: { icon: 'i-lucide-layout', colorClass: 'text-purple-400' },
  layouts: { icon: 'i-lucide-layout', colorClass: 'text-purple-400' },
  templates: { icon: 'i-lucide-layout', colorClass: 'text-purple-400' },
  templatetags: { icon: 'i-lucide-layout', colorClass: 'text-purple-400' },
  screens: { icon: 'i-lucide-layout', colorClass: 'text-purple-400' },

  // Assets & Media
  assets: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  images: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  img: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  icons: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  public: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  static: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  media: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  uploads: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  storage: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  files: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  pictures: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },

  // API & Services
  api: { icon: 'i-lucide-globe', colorClass: 'text-sky-400' },
  apis: { icon: 'i-lucide-globe', colorClass: 'text-sky-400' },
  apigateway: { icon: 'i-lucide-globe', colorClass: 'text-sky-400' },
  gateway: { icon: 'i-lucide-globe', colorClass: 'text-sky-400' },
  services: { icon: 'i-lucide-globe', colorClass: 'text-sky-400' },
  server: { icon: 'i-lucide-globe', colorClass: 'text-sky-400' },
  backend: { icon: 'i-lucide-globe', colorClass: 'text-sky-400' },
  controllers: { icon: 'i-lucide-globe', colorClass: 'text-sky-400' },
  handlers: { icon: 'i-lucide-globe', colorClass: 'text-sky-400' },
  endpoints: { icon: 'i-lucide-globe', colorClass: 'text-sky-400' },

  // Database & Models
  database: { icon: 'i-lucide-cog', colorClass: 'text-rose-400' },
  db: { icon: 'i-lucide-cog', colorClass: 'text-rose-400' },
  migrations: { icon: 'i-lucide-cog', colorClass: 'text-rose-400' },
  migration: { icon: 'i-lucide-cog', colorClass: 'text-rose-400' },
  sql: { icon: 'i-lucide-cog', colorClass: 'text-rose-400' },
  models: { icon: 'i-lucide-cog', colorClass: 'text-rose-400' },
  model: { icon: 'i-lucide-cog', colorClass: 'text-rose-400' },
  entities: { icon: 'i-lucide-cog', colorClass: 'text-rose-400' },
  repositories: { icon: 'i-lucide-cog', colorClass: 'text-rose-400' },

  // Config & Settings
  config: { icon: 'i-lucide-settings', colorClass: 'text-amber-400' },
  configs: { icon: 'i-lucide-settings', colorClass: 'text-amber-400' },
  configuration: { icon: 'i-lucide-settings', colorClass: 'text-amber-400' },
  settings: { icon: 'i-lucide-settings', colorClass: 'text-amber-400' },
  '.config': { icon: 'i-lucide-settings', colorClass: 'text-amber-400' },
  env: { icon: 'i-lucide-settings', colorClass: 'text-amber-400' },
  environments: { icon: 'i-lucide-settings', colorClass: 'text-amber-400' },

  // Utils & Helpers
  utils: { icon: 'i-lucide-wrench', colorClass: 'text-amber-400' },
  util: { icon: 'i-lucide-wrench', colorClass: 'text-amber-400' },
  helpers: { icon: 'i-lucide-wrench', colorClass: 'text-amber-400' },
  helper: { icon: 'i-lucide-wrench', colorClass: 'text-amber-400' },
  lib: { icon: 'i-lucide-wrench', colorClass: 'text-amber-400' },
  libs: { icon: 'i-lucide-wrench', colorClass: 'text-amber-400' },
  tools: { icon: 'i-lucide-wrench', colorClass: 'text-amber-400' },
  common: { icon: 'i-lucide-wrench', colorClass: 'text-amber-400' },
  shared: { icon: 'i-lucide-wrench', colorClass: 'text-amber-400' },

  // Testing
  test: { icon: 'i-lucide-flask-conical', colorClass: 'text-lime-400' },
  tests: { icon: 'i-lucide-flask-conical', colorClass: 'text-lime-400' },
  __tests__: { icon: 'i-lucide-flask-conical', colorClass: 'text-lime-400' },
  spec: { icon: 'i-lucide-flask-conical', colorClass: 'text-lime-400' },
  specs: { icon: 'i-lucide-flask-conical', colorClass: 'text-lime-400' },
  cypress: { icon: 'i-lucide-flask-conical', colorClass: 'text-lime-400' },
  e2e: { icon: 'i-lucide-flask-conical', colorClass: 'text-lime-400' },
  unit: { icon: 'i-lucide-flask-conical', colorClass: 'text-lime-400' },
  integration: { icon: 'i-lucide-flask-conical', colorClass: 'text-lime-400' },

  // Node modules & Vendors
  node_modules: { icon: 'i-lucide-folder-archive', colorClass: 'text-emerald-500' },
  vendor: { icon: 'i-lucide-folder-archive', colorClass: 'text-emerald-500' },

  // Build & Output
  dist: { icon: 'i-lucide-folder-archive', colorClass: 'text-slate-400' },
  out: { icon: 'i-lucide-folder-archive', colorClass: 'text-slate-400' },
  build: { icon: 'i-lucide-folder-archive', colorClass: 'text-slate-400' },
  '.output': { icon: 'i-lucide-folder-archive', colorClass: 'text-slate-400' },
  '.nuxt': { icon: 'i-lucide-folder-archive', colorClass: 'text-slate-400' },
  '.next': { icon: 'i-lucide-folder-archive', colorClass: 'text-slate-400' },
  target: { icon: 'i-lucide-folder-archive', colorClass: 'text-slate-400' },
  bin: { icon: 'i-lucide-folder-archive', colorClass: 'text-slate-400' }
}

/**
 * File extension mappings for Makarya Studio Palette
 */
const FILE_ICON_MAP: Record<string, IconDefinition> = {
  // Web & UI
  vue: { icon: 'i-lucide-file-code', colorClass: 'text-emerald-400' },
  ts: { icon: 'i-lucide-file-code-2', colorClass: 'text-blue-400' },
  tsx: { icon: 'i-lucide-file-code-2', colorClass: 'text-blue-400' },
  js: { icon: 'i-lucide-file-code', colorClass: 'text-yellow-400' },
  jsx: { icon: 'i-lucide-file-code', colorClass: 'text-yellow-400' },
  mjs: { icon: 'i-lucide-file-code', colorClass: 'text-yellow-400' },
  cjs: { icon: 'i-lucide-file-code', colorClass: 'text-yellow-400' },
  html: { icon: 'i-lucide-globe', colorClass: 'text-orange-400' },
  htm: { icon: 'i-lucide-globe', colorClass: 'text-orange-400' },
  css: { icon: 'i-lucide-palette', colorClass: 'text-sky-400' },
  scss: { icon: 'i-lucide-palette', colorClass: 'text-pink-400' },
  less: { icon: 'i-lucide-palette', colorClass: 'text-indigo-400' },

  // Backend languages
  php: { icon: 'i-lucide-code-xml', colorClass: 'text-indigo-400' },
  phtml: { icon: 'i-lucide-code-xml', colorClass: 'text-indigo-400' },
  py: { icon: 'i-lucide-file-code', colorClass: 'text-amber-300' },
  rs: { icon: 'i-lucide-file-code', colorClass: 'text-orange-500' },
  go: { icon: 'i-lucide-file-code', colorClass: 'text-cyan-400' },
  java: { icon: 'i-lucide-file-code', colorClass: 'text-red-400' },
  c: { icon: 'i-lucide-file-code', colorClass: 'text-blue-500' },
  cpp: { icon: 'i-lucide-file-code', colorClass: 'text-blue-500' },
  cs: { icon: 'i-lucide-file-code', colorClass: 'text-purple-400' },
  sql: { icon: 'i-lucide-database', colorClass: 'text-rose-400' },

  // Data & Config
  json: { icon: 'i-lucide-file-json', colorClass: 'text-amber-300' },
  json5: { icon: 'i-lucide-file-json', colorClass: 'text-amber-300' },
  yml: { icon: 'i-lucide-settings-2', colorClass: 'text-rose-300' },
  yaml: { icon: 'i-lucide-settings-2', colorClass: 'text-rose-300' },
  xml: { icon: 'i-lucide-file-code', colorClass: 'text-orange-400' },
  toml: { icon: 'i-lucide-settings-2', colorClass: 'text-amber-400' },
  md: { icon: 'i-lucide-file-text', colorClass: 'text-blue-300' },
  markdown: { icon: 'i-lucide-file-text', colorClass: 'text-blue-300' },

  // Shell & Scripts
  sh: { icon: 'i-lucide-terminal', colorClass: 'text-emerald-400' },
  bash: { icon: 'i-lucide-terminal', colorClass: 'text-emerald-400' },
  zsh: { icon: 'i-lucide-terminal', colorClass: 'text-emerald-400' },
  bat: { icon: 'i-lucide-terminal', colorClass: 'text-blue-400' },
  cmd: { icon: 'i-lucide-terminal', colorClass: 'text-blue-400' },
  ps1: { icon: 'i-lucide-terminal', colorClass: 'text-blue-400' },

  // Images & Media
  png: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  jpg: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  jpeg: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  svg: { icon: 'i-lucide-image', colorClass: 'text-amber-400' },
  gif: { icon: 'i-lucide-image', colorClass: 'text-purple-400' },
  webp: { icon: 'i-lucide-image', colorClass: 'text-pink-400' },
  ico: { icon: 'i-lucide-image', colorClass: 'text-yellow-400' },

  // Archives
  zip: { icon: 'i-lucide-archive', colorClass: 'text-amber-500' },
  tar: { icon: 'i-lucide-archive', colorClass: 'text-amber-500' },
  gz: { icon: 'i-lucide-archive', colorClass: 'text-amber-500' },
  '7z': { icon: 'i-lucide-archive', colorClass: 'text-amber-500' },
  pdf: { icon: 'i-lucide-file-text', colorClass: 'text-red-400' },
  lock: { icon: 'i-lucide-lock', colorClass: 'text-amber-400' }
}

/**
 * Studio Icon Resolver for File Tree Node
 */
export function resolveStudioIcon(
  fileName: string,
  isDirectory: boolean,
  isExpanded = false
): IconDefinition {
  const lowerName = fileName.toLowerCase()

  if (isDirectory) {
    const customDir = DIRECTORY_ICON_MAP[lowerName]
    if (customDir) {
      return {
        icon: isExpanded ? 'i-lucide-folder-open' : customDir.icon,
        colorClass: customDir.colorClass
      }
    }
    return {
      icon: isExpanded ? 'i-lucide-folder-open' : 'i-lucide-folder',
      colorClass: 'text-amber-400'
    }
  }

  // Exact filename matches
  if (lowerName === 'package.json') return { icon: 'i-lucide-package', colorClass: 'text-emerald-400' }
  if (lowerName === 'tsconfig.json') return { icon: 'i-lucide-settings-2', colorClass: 'text-blue-400' }
  if (lowerName === 'dockerfile' || lowerName.startsWith('docker-compose')) return { icon: 'i-lucide-container', colorClass: 'text-sky-400' }
  if (lowerName.startsWith('.env')) return { icon: 'i-lucide-lock', colorClass: 'text-amber-400' }
  if (lowerName.startsWith('.git')) return { icon: 'i-lucide-git-branch', colorClass: 'text-orange-400' }

  // By extension
  const extMatch = fileName.match(/\.([^.]+)$/)
  if (extMatch) {
    const ext = extMatch[1].toLowerCase()
    const customExt = FILE_ICON_MAP[ext]
    if (customExt) return customExt
  }

  return { icon: 'i-lucide-file', colorClass: 'text-slate-400' }
}

/**
 * Makarya Studio Palette & Badges Official Plugin
 */
export const StudioPalettePlugin = definePlugin({
  manifest: {
    id: 'makarya.builtin.theme-customizer',
    name: 'Makarya Studio Palette & Badges',
    version: '1.0.0',
    description: 'Kustomisasi ikon berkas warna-warni (Vibrant Colors) dan badge status bar modern untuk Makarya IDE.',
    author: 'Makarya UI Lab',
    icon: 'i-lucide-palette',
    category: 'other',
    contributes: {
      commands: [
        {
          id: 'theme.togglePalette',
          title: 'Tema: Ubah Palet Warna Studio',
          category: 'Tema',
          icon: 'i-lucide-palette'
        }
      ]
    }
  },

  activate(context: PluginContext) {
    // 1. Status bar indicator
    const item = context.ui.createStatusBarItem({
      id: 'status-studio-palette',
      text: 'palette: vibrant',
      icon: 'i-lucide-palette',
      tooltip: 'Makarya Studio Palette aktif: Ikon berkas berwarna cerah & aksen dinamis',
      command: 'theme.togglePalette',
      alignment: 'left',
      color: '#a855f7'
    })
    item.show()
    context.subscriptions.push(item)

    // 2. Command
    context.subscriptions.push(
      context.commands.registerCommand('theme.togglePalette', () => {
        context.ui.showToast({
          title: 'Makarya Studio Palette',
          message: 'Palet warna Studio aktif: Menampilkan ikon direktori & berkas dengan aksen warna penuh.',
          type: 'info'
        })
      })
    )
  }
})

export default StudioPalettePlugin
