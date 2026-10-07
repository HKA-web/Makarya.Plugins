# @makarya/sdk

> **The Official Plugin & Extension SDK for Makarya IDE**  
> Build, test, and distribute custom tools, AI capabilities, sidebar views, and editor features for Makarya IDE without needing access to the core repository source code.

---

## 🌟 Overview

Makarya IDE provides a modular extension architecture inspired by Antigravity and VS Code. With `@makarya/sdk`, any developer can build lightweight, high-performance plugins using TypeScript or JavaScript.

### What You Can Build:
- ⚡ **Custom Commands**: Register commands runnable via Command Palette (`Ctrl+K`), shortcuts, or menus.
- 🎨 **Status Bar Items**: Show real-time statuses (Git branch, lint counters, build badges) on the bottom bar.
- 🧩 **Sidebar Panels**: Add dedicated workspace tools, tree views, custom HTML/Vue panels.
- 🤖 **Custom AI Agent Tools**: Register specialized autonomous tools into Makarya Copilot AI Agent.
- 📝 **Editor Integrations**: Manipulate Monaco editor text, listen to file save events, and jump to lines.
- 💾 **Isolated Plugin Storage**: Store plugin configuration and persistent user data safely.

---

## 🚀 Quickstart

### 1. Initialize Plugin Project
Create a new folder for your plugin:
```bash
mkdir makarya-git-stats
cd makarya-git-stats
npm init -y
npm install -D typescript @makarya/sdk
```

### 2. Configure `package.json` Manifest
Define your plugin manifest in `package.json`:
```json
{
  "name": "makarya-git-stats",
  "displayName": "Git Statistics & Quick Actions",
  "version": "1.0.0",
  "description": "Displays current Git branch and quick commit status on Makarya status bar.",
  "author": "Your Name",
  "main": "dist/index.js",
  "icon": "i-lucide-git-branch",
  "category": "tools",
  "contributes": {
    "commands": [
      {
        "id": "gitStats.showSummary",
        "title": "Git: Tampilkan Status Ringkas",
        "icon": "i-lucide-git-commit",
        "shortcut": "Ctrl+Alt+G"
      }
    ],
    "statusBarItems": [
      {
        "id": "gitStats.branchStatus",
        "text": "Git: Active",
        "command": "gitStats.showSummary"
      }
    ]
  }
}
```

### 3. Write Your Plugin Code (`src/index.ts`)
```ts
import { definePlugin, PluginContext } from '@makarya/sdk'

export default definePlugin({
  manifest: {
    id: 'com.example.git-stats',
    name: 'Git Statistics',
    version: '1.0.0',
    description: 'Quick Git stats for Makarya IDE',
    icon: 'i-lucide-git-branch',
    category: 'tools'
  },

  async activate(context: PluginContext) {
    // 1. Create a status bar item
    const branchItem = context.ui.createStatusBarItem({
      id: 'git-branch-status',
      text: '🌿 main',
      tooltip: 'Klik untuk melihat status Git',
      command: 'gitStats.showSummary',
      alignment: 'left',
      color: '#42b883'
    })
    branchItem.show()
    context.subscriptions.push(branchItem)

    // 2. Register command
    context.subscriptions.push(
      context.commands.registerCommand('gitStats.showSummary', async () => {
        const root = context.workspace.getActiveRootPath()
        if (!root) {
          context.ui.showToast({
            title: 'Git Stats',
            message: 'Tidak ada project aktif yang dibuka.',
            type: 'warn'
          })
          return
        }

        const res = await context.terminal.executeCommand('git status --short')
        context.ui.showToast({
          title: 'Status Berkas Git',
          message: res.stdout || 'Tidak ada perubahan berkas.',
          type: 'info'
        })
      })
    )

    // 3. Register custom AI Agent Tool (Antigravity-style)
    context.subscriptions.push(
      context.agent.registerTool({
        name: 'get_git_log',
        description: 'Mendapatkan daftar commit git terakhir dari project aktif',
        parameters: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Jumlah commit (default 5)' }
          }
        },
        execute: async (args) => {
          const limit = args.limit || 5
          const result = await context.terminal.executeCommand(`git log -n ${limit} --oneline`)
          return { commits: result.stdout.split('\n').filter(Boolean) }
        }
      })
    )
  },

  deactivate(context: PluginContext) {
    // Subscriptions in context.subscriptions are automatically cleaned up!
  }
})
```

---

## 📚 SDK API Reference

### `context.commands`
- `registerCommand(commandId: string, handler: (...args: any[]) => any): Disposable`
- `executeCommand<T>(commandId: string, ...args: any[]): Promise<T>`

### `context.workspace`
- `getWorkspaceRoots()`: Returns list of opened workspace root folders.
- `getActiveRootPath()`: Returns the currently active workspace path.
- `getOpenTabs()`: Returns list of open editor tabs.
- `getActiveTab()`: Returns the currently active editor tab.
- `openFile(filePath: string, targetLine?: number)`: Opens a file into Monaco editor.
- `saveActiveFile()`: Saves the active file to disk.
- `onDidSaveFile(listener)`: Subscribes to file save events.

### `context.editor`
- `insertText(text: string)`: Inserts text at cursor position.
- `replaceSelection(text: string)`: Replaces current selection with text.
- `getSelectedText()`: Returns current selected text in active editor.
- `getCursorPosition()`: Returns `{ lineNumber, column }`.
- `setCursorPosition(line, col)`: Moves cursor to specified position.

### `context.ui`
- `showToast({ title, message, type })`: Displays notification toast.
- `showConfirmDialog({ title, message, onAccept, onReject })`: Shows confirmation popup.
- `createStatusBarItem(options)`: Adds item to bottom status bar.
- `registerSidebarView(view)`: Registers custom sidebar tab.

### `context.agent` (AI Copilot Extensibility)
- `registerTool(toolDef)`: Registers autonomous tool available to Makarya AI Agent during chat execution.
- `sendMessage(prompt)`: Sends a query into the AI Copilot.

### `context.terminal`
- `executeCommand(cmd)`: Executes a command synchronously or asynchronously in background.
- `createTerminal(options)`: Spawns an interactive pty terminal session.

### `context.storage`
- `get(key, defaultValue)`: Gets persistent plugin-scoped data.
- `set(key, value)`: Sets persistent plugin-scoped data.
- `delete(key)`: Deletes key.

---

## 📁 Installing Plugins into Makarya IDE

Place your compiled plugin folder inside one of the following directories:
- **Global User Plugins**: `~/.makarya/plugins/<plugin-id>/` (or `%APPDATA%/makarya-workspace/plugins/<plugin-id>/`)
- **Project Plugins**: `<workspace-root>/.makarya/plugins/<plugin-id>/`

Makarya IDE automatically scans and activates plugins upon startup and provides hot-reload in the Extension Manager modal.
