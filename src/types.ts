/**
 * @makarya/sdk - Official TypeScript Definitions for Makarya IDE Plugins & Extensions
 */

export interface Disposable {
  dispose(): void
}

export type PluginCategory =
  | 'editor'
  | 'tools'
  | 'ai'
  | 'themes'
  | 'language'
  | 'productivity'
  | 'database'
  | 'custom'

export interface CommandContribution {
  id: string
  title: string
  category?: string
  icon?: string
  shortcut?: string
}

export interface SidebarViewContribution {
  id: string
  title: string
  icon: string
  order?: number
  render?: (container: HTMLElement, context: PluginContext) => Disposable | void
}

export interface StatusBarItemOptions {
  id: string
  text: string
  icon?: string
  tooltip?: string
  command?: string
  alignment?: 'left' | 'right'
  priority?: number
  color?: string
}

export interface StatusBarItem extends Disposable {
  readonly id: string
  text: string
  icon?: string
  tooltip?: string
  command?: string
  color?: string
  show(): void
  hide(): void
}

export interface AIToolParameterSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  description?: string
  enum?: string[]
  items?: Record<string, any>
  properties?: Record<string, any>
  required?: string[]
}

export interface AIToolDefinition {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, AIToolParameterSchema>
    required?: string[]
  }
  execute: (args: Record<string, any>, context: PluginContext) => Promise<any> | any
}

export interface PluginContributions {
  commands?: CommandContribution[]
  sidebarViews?: SidebarViewContribution[]
  statusBarItems?: StatusBarItemOptions[]
  aiTools?: Array<Omit<AIToolDefinition, 'execute'>>
}

export interface PluginManifest {
  id: string
  name: string
  version: string
  displayName?: string
  description?: string
  author?: string
  homepage?: string
  icon?: string
  category?: PluginCategory
  enabledByDefault?: boolean
  isRemovable?: boolean
  contributes?: PluginContributions
}

export interface ToastOptions {
  message: string
  title?: string
  type?: 'info' | 'success' | 'warn' | 'error'
  duration?: number
}

export interface ConfirmDialogOptions {
  title: string
  message: string
  acceptLabel?: string
  rejectLabel?: string
  onAccept?: () => void
  onReject?: () => void
}

export interface CommandAPI {
  registerCommand(commandId: string, handler: (...args: any[]) => any): Disposable
  executeCommand<T = any>(commandId: string, ...args: any[]): Promise<T>
  getRegisteredCommands(): string[]
}

export interface WorkspaceTabInfo {
  id: string
  title: string
  filePath?: string
  content: string
  isDirty: boolean
  language: string
}

export interface WorkspaceRootInfo {
  id: string
  path: string
  name: string
}

export interface WorkspaceAPI {
  getWorkspaceRoots(): WorkspaceRootInfo[]
  getActiveRootPath(): string | null
  getOpenTabs(): WorkspaceTabInfo[]
  getActiveTab(): WorkspaceTabInfo | null
  openFile(filePath: string, targetLine?: number): Promise<void>
  closeTab(tabId: string): void
  saveActiveFile(): Promise<{ success: boolean; message: string }>
  readFile(filePath: string): Promise<{ content: string; error?: string }>
  writeFile(filePath: string, content: string): Promise<{ success: boolean; error?: string }>
  createFile(parentDirectoryPath: string, fileName: string): Promise<{ success: boolean; message: string }>
  createFolder(parentDirectoryPath: string, folderName: string): Promise<{ success: boolean; message: string }>
  findFiles(searchQuery?: string): Promise<Array<{ name: string; path: string; relativePath: string }>>
  onDidOpenFile(listener: (tab: WorkspaceTabInfo) => void): Disposable
  onDidSaveFile(listener: (file: { path: string; content: string }) => void): Disposable
  onDidChangeActiveTab(listener: (tab: WorkspaceTabInfo | null) => void): Disposable
}

export interface EditorAPI {
  insertText(text: string): void
  replaceSelection(text: string): void
  getSelectedText(): string
  getCursorPosition(): { lineNumber: number; column: number } | null
  setCursorPosition(lineNumber: number, column: number): void
  revealLine(lineNumber: number): void
  getRawMonacoEditor(): any | null
}

export interface UIAPI {
  showToast(options: ToastOptions | string): void
  showConfirmDialog(options: ConfirmDialogOptions): void
  createStatusBarItem(options: StatusBarItemOptions): StatusBarItem
  registerSidebarView(view: SidebarViewContribution): Disposable
}

export interface StorageAPI {
  get<T = any>(key: string, defaultValue?: T): T
  set<T = any>(key: string, value: T): void
  delete(key: string): void
  clear(): void
}

export interface AgentAPI {
  registerTool(tool: AIToolDefinition): Disposable
  sendMessage(prompt: string, contextSnippet?: string): Promise<void>
  getAvailableModels(): Promise<string[]>
  onStreamToken(listener: (data: { requestId: string; deltaContent: string }) => void): Disposable
  onToolExecuted(listener: (data: { toolName: string; args: any; result: any }) => void): Disposable
}

export interface TerminalAPI {
  executeCommand(command: string): Promise<{ exitCode: number; stdout: string; stderr: string }>
  createTerminal(options?: { name?: string; cwd?: string; shell?: string }): Promise<{
    id: string
    write: (data: string) => void
    kill: () => void
  }>
}

export interface EventsAPI {
  emit(eventName: string, payload?: any): void
  on(eventName: string, handler: (payload: any) => void): Disposable
}

export interface DatabaseAPI {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>
  getSetting(key: string): Promise<string | null>
  setSetting(key: string, value: string): Promise<void>
}

export interface SystemAPI {
  getInfo(): Promise<{ platform: string; arch: string; nodeVersion: string }>
  openExternal(url: string): Promise<void>
}

export interface PluginContext {
  readonly manifest: Readonly<PluginManifest>
  readonly subscriptions: Disposable[]
  readonly commands: CommandAPI
  readonly workspace: WorkspaceAPI
  readonly editor: EditorAPI
  readonly ui: UIAPI
  readonly storage: StorageAPI
  readonly agent: AgentAPI
  readonly terminal: TerminalAPI
  readonly events: EventsAPI
  readonly db: DatabaseAPI
  readonly system: SystemAPI
}

export interface MakaryaPlugin {
  manifest: PluginManifest
  activate(context: PluginContext): void | Promise<void>
  deactivate?(context: PluginContext): void | Promise<void>
}
