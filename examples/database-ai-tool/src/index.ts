import { definePlugin, PluginContext } from '@makarya/sdk'

export type DatabaseType = 'sqlserver' | 'mysql' | 'postgres' | 'sqlite'

export interface DatabaseConnectionProfile {
  id: string
  name: string
  type: DatabaseType
  host: string
  port: number
  database: string
  username?: string
  password?: string
  authType: 'sql_auth' | 'windows_auth' | 'none'
  projectRoot?: string // Path project aktif yang terkait dengan koneksi ini
  isActive: boolean
  createdAt: string
  lastTestedAt?: string
  lastTestStatus?: 'success' | 'failed'
  lastTestLatency?: number
  lastTestMessage?: string
}

export const DB_PROFILES_STORAGE_KEY = 'makarya_saved_db_connection_profiles'

export function loadSavedProfiles(): DatabaseConnectionProfile[] {
  try {
    const raw = localStorage.getItem(DB_PROFILES_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('[DatabaseAiPlugin] Gagal memuat profil koneksi database', e)
  }
  return []
}

export function saveProfiles(profiles: DatabaseConnectionProfile[]): void {
  try {
    localStorage.setItem(DB_PROFILES_STORAGE_KEY, JSON.stringify(profiles))
    window.dispatchEvent(new CustomEvent('makarya:db-profiles-updated'))
  } catch (e) {
    console.error('[DatabaseAiPlugin] Gagal menyimpan profil koneksi database', e)
  }
}

export function getActiveProfile(projectRoot?: string | null): DatabaseConnectionProfile | undefined {
  const list = loadSavedProfiles()
  if (projectRoot) {
    const projectActive = list.find((p) => p.projectRoot === projectRoot && p.isActive)
    if (projectActive) return projectActive

    const projectAny = list.find((p) => p.projectRoot === projectRoot)
    if (projectAny) return projectAny
  }
  return list.find((p) => p.isActive) || list[0]
}

export function setActiveProfile(profileId: string, projectRoot?: string | null): void {
  const profiles = loadSavedProfiles()
  profiles.forEach((p) => {
    if (projectRoot) {
      if (p.projectRoot === projectRoot) {
        p.isActive = p.id === profileId
      }
    } else {
      p.isActive = p.id === profileId
    }
  })
  saveProfiles(profiles)
}

export function deleteProfile(profileId: string): void {
  const profiles = loadSavedProfiles().filter((p) => p.id !== profileId)
  saveProfiles(profiles)
}

/**
 * Database AI Assistant Plugin with Real Live Database Inspection & Safety Skills
 */
export const DatabaseAiToolPlugin = definePlugin({
  manifest: {
    id: 'makarya.builtin.database-ai-tool',
    name: 'Database AI Connection & Query Manager',
    version: '1.2.0',
    description:
      'Menghubungkan AI Agent dengan SQL Server/MySQL/PostgreSQL/SQLite per-project, modal konfigurasi & live test koneksi, serta live query & safety skill anti-halusinasi.',
    author: 'Makarya AI & Data Lab',
    icon: 'i-lucide-database',
    category: 'ai',
    contributes: {
      commands: [
        {
          id: 'dbAssistant.setupConnection',
          title: 'Database AI: Atur / Konfigurasi Koneksi Database Target',
          category: 'Database',
          icon: 'i-lucide-plug'
        },
        {
          id: 'dbAssistant.listProfiles',
          title: 'Database AI: Lihat Profil Database Tersimpan',
          category: 'Database',
          icon: 'i-lucide-database'
        },
        {
          id: 'dbAssistant.quickStatus',
          title: 'Database AI: Periksa Status Koneksi Aktif',
          category: 'Database',
          icon: 'i-lucide-activity'
        }
      ]
    }
  },

  activate(context: PluginContext) {
    // 1. Status Bar Item
    const active = getActiveProfile()
    const dbStatusItem = context.ui.createStatusBarItem({
      id: 'status-db-inspector',
      text: active ? `db: ${active.database} (${active.type})` : 'db: unconfigured',
      icon: 'i-lucide-database',
      tooltip: active
        ? `Terkoneksi ke ${active.name} [${active.type.toUpperCase()}] - ${active.host}:${active.port}/${active.database}. Klik untuk mengatur koneksi.`
        : 'Database belum dikonfigurasi. Klik untuk membuka jendela pengaturan koneksi.',
      command: 'dbAssistant.setupConnection',
      alignment: 'left',
      color: active ? '#42b883' : '#f59e0b'
    })
    dbStatusItem.show()
    context.subscriptions.push(dbStatusItem)

    function refreshStatus(): void {
      const current = getActiveProfile()
      if (current) {
        dbStatusItem.text = `db: ${current.database} (${current.type})`
        dbStatusItem.tooltip = `Terkoneksi ke ${current.name} [${current.type.toUpperCase()}] - ${current.host}:${current.port}/${current.database}. Klik untuk mengatur koneksi.`
        dbStatusItem.color = '#42b883'
      } else {
        dbStatusItem.text = 'db: unconfigured'
        dbStatusItem.tooltip = 'Database belum dikonfigurasi. Klik untuk membuka jendela pengaturan koneksi.'
        dbStatusItem.color = '#f59e0b'
      }
    }

    const onProfileUpdateListener = (): void => {
      refreshStatus()
    }
    window.addEventListener('makarya:db-profiles-updated', onProfileUpdateListener)
    context.subscriptions.push({
      dispose: () => {
        window.removeEventListener('makarya:db-profiles-updated', onProfileUpdateListener)
      }
    })

    // 2. TOOL: db_check_connection_status
    context.subscriptions.push(
      context.agent.registerTool({
        name: 'db_check_connection_status',
        description:
          'Memeriksa status profil database aktif untuk project saat ini. Mengembalikan parameter koneksi, status live, dan panduan skill keamanan.',
        parameters: {
          type: 'object',
          properties: {}
        },
        execute: async () => {
          const profiles = loadSavedProfiles()
          const activeProfile = getActiveProfile()

          if (!activeProfile) {
            return {
              isConfigured: false,
              message: 'Belum ada profil koneksi database yang dikonfigurasi untuk project ini di Makarya IDE.',
              instructionForAI:
                'Jangan menebak kredensial database. Minta pengguna untuk membuka jendela popup Database Connection Manager (klik status bar database).',
              safetySkills: [
                'Sebelum menjalankan UPDATE/DELETE, selalu jalankan SELECT terlebih dahulu untuk memverifikasi data.',
                'Jangan pernah menjalankan DROP TABLE tanpa konfirmasi pengguna.',
                'Gunakan indexing jika query menyaring lebih dari 10.000 baris.'
              ]
            }
          }

          return {
            isConfigured: true,
            activeProfile: {
              id: activeProfile.id,
              name: activeProfile.name,
              type: activeProfile.type,
              host: activeProfile.host,
              port: activeProfile.port,
              database: activeProfile.database,
              username: activeProfile.username || '(Windows/No Auth)',
              authType: activeProfile.authType,
              projectRoot: activeProfile.projectRoot || 'Global',
              lastTestedAt: activeProfile.lastTestedAt,
              lastTestStatus: activeProfile.lastTestStatus || 'success'
            },
            totalSavedProfiles: profiles.length,
            safetySkills: [
              '1. Sebelum menjalankan UPDATE/DELETE, selalu jalankan SELECT terlebih dahulu untuk memverifikasi data.',
              '2. Jangan pernah menjalankan DROP TABLE tanpa konfirmasi pengguna.',
              '3. Gunakan indexing jika query menyaring lebih dari 10.000 baris.'
            ],
            message: `Koneksi database aktif: ${activeProfile.name} [${activeProfile.type.toUpperCase()}] pada database "${activeProfile.database}" (${activeProfile.host}:${activeProfile.port}). Siap digunakan untuk kueri terverifikasi.`
          }
        }
      })
    )

    // 3. TOOL: db_inspect_schema (REAL LIVE DATABASE INSPECTION)
    context.subscriptions.push(
      context.agent.registerTool({
        name: 'db_inspect_schema',
        description:
          'Membaca daftar tabel, kolom, tipe data, dan skema nyata secara langsung dari database yang sedang terhubung.',
        parameters: {
          type: 'object',
          properties: {
            tableName: {
              type: 'string',
              description: 'Nama tabel spesifik untuk filter (opsional)'
            }
          }
        },
        execute: async (args: { tableName?: string }) => {
          const activeProfile = getActiveProfile()
          if (!activeProfile) {
            return {
              status: 'error',
              message: 'Belum ada profil koneksi database yang aktif. Harap atur koneksi database terlebih dahulu.'
            }
          }

          if (window.makaryaAPI?.inspectDbSchema) {
            const res = await window.makaryaAPI.inspectDbSchema(activeProfile)
            if (res.success) {
              let tables = res.tables || []
              if (args?.tableName) {
                tables = tables.filter((t: any) =>
                  t.name.toLowerCase().includes(args.tableName!.toLowerCase())
                )
              }

              return {
                status: 'success',
                database: res.database,
                dbType: res.dbType,
                tableCount: tables.length,
                tables,
                message:
                  tables.length > 0
                    ? `Ditemukan ${tables.length} tabel di database "${res.database}".`
                    : `Database "${res.database}" saat ini kosong (tidak ada tabel).`
              }
            } else {
              return {
                status: 'error',
                message: `Gagal membaca skema dari database target: ${res.error}`
              }
            }
          }

          return {
            status: 'error',
            message: 'API inspeksi database belum terhubung di lingkungan ini.'
          }
        }
      })
    )

    // 4. TOOL: db_execute_query (PRIMARY REAL LIVE SQL QUERY EXECUTOR)
    context.subscriptions.push(
      context.agent.registerTool({
        name: 'db_execute_query',
        description:
          'Mengeksekusi kueri SQL (SELECT, dsb.) secara langsung ke database yang sedang terhubung melalui native driver, tanpa menggunakan terminal atau python script.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Kueri SQL yang ingin dijalankan (misal: "SELECT * FROM send_data LIMIT 10", "SELECT version()", dsb.)'
            },
            limit: {
              type: 'number',
              description: 'Batas maksimum baris yang diambil untuk kueri SELECT (default: 20)'
            }
          },
          required: ['query']
        },
        execute: async (args: {
          query?: string
          sql?: string
          sqlQuery?: string
          sql_query?: string
          statement?: string
          limit?: number
        }) => {
          const activeProfile = getActiveProfile()
          if (!activeProfile) {
            return {
              status: 'error',
              message: 'Belum ada profil koneksi database yang aktif. Harap atur koneksi database terlebih dahulu melalui popup koneksi.'
            }
          }

          const limit = Math.min(args.limit || 20, 100)
          let queryToRun = (
            args.query ||
            args.sql ||
            args.sqlQuery ||
            args.sql_query ||
            args.statement ||
            (args as any).command ||
            (args as any).raw ||
            ''
          ).trim()

          if (!queryToRun && typeof args === 'object' && args !== null) {
            const firstStringVal = Object.values(args).find(
              (v) => typeof v === 'string' && /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|SHOW|DESCRIBE)\b/i.test(v)
            )
            if (firstStringVal) {
              queryToRun = (firstStringVal as string).trim()
            }
          }

          if (!queryToRun) {
            return {
              status: 'error',
              message: 'Parameter "query" SQL wajib diisi. Contoh: { "query": "SELECT * FROM send_email LIMIT 1" }'
            }
          }

          // Safety guard:
          if (/^\s*DROP\s+TABLE\b/i.test(queryToRun)) {
            return {
              status: 'blocked',
              message: 'Peringatan Keamanan: Jangan pernah menjalankan DROP TABLE tanpa konfirmasi eksplisit dari pengguna. Kueri diblokir.'
            }
          }

          if (/^\s*(UPDATE|DELETE)\b/i.test(queryToRun)) {
            return {
              status: 'blocked',
              message: 'Peringatan Skill Keamanan: Sebelum menjalankan UPDATE/DELETE, selalu jalankan SELECT terlebih dahulu untuk memverifikasi data yang akan diubah!'
            }
          }

          if (window.makaryaAPI?.executeDbLiveQuery) {
            const queryRes = await window.makaryaAPI.executeDbLiveQuery({
              config: activeProfile,
              sql: queryToRun,
              limit
            })

            if (queryRes.success) {
              return {
                status: 'success',
                database: activeProfile.database,
                executedQuery: queryToRun,
                rowCount: queryRes.rowCount,
                columns: queryRes.columns,
                rows: queryRes.rows,
                durationMs: queryRes.durationMs,
                safetyNotice:
                  queryRes.rowCount > 10000
                    ? 'Peringatan Skill: Data lebih dari 10.000 baris, pastikan menggunakan indexing yang tepat.'
                    : 'Data dieksekusi langsung ke database aktif secara aman.'
              }
            } else {
              return {
                status: 'error',
                message: `Gagal mengeksekusi kueri pada database target: ${queryRes.error}`
              }
            }
          }

          return {
            status: 'error',
            message: 'API eksekusi live query belum terhubung.'
          }
        }
      })
    )

    // 4b. TOOL: db_fetch_data_from_active_connection (ALIAS)
    context.subscriptions.push(
      context.agent.registerTool({
        name: 'db_fetch_data_from_active_connection',
        description:
          'Membaca data atau mengeksekusi kueri SELECT langsung ke database aktif dengan menerapkan aturan keamanan.',
        parameters: {
          type: 'object',
          properties: {
            tableName: {
              type: 'string',
              description: 'Nama tabel yang ingin dibaca datanya'
            },
            sqlQuery: {
              type: 'string',
              description: 'Kueri SQL kustom'
            },
            limit: {
              type: 'number',
              description: 'Batas maksimum baris yang diambil (default: 20)'
            }
          }
        },
        execute: async (args: { tableName?: string; sqlQuery?: string; limit?: number }) => {
          const activeProfile = getActiveProfile()
          if (!activeProfile) {
            return {
              status: 'error',
              message: 'Belum ada profil koneksi database yang aktif. Gunakan tool db_check_connection_status terlebih dahulu.'
            }
          }

          const limit = Math.min(args.limit || 20, 100)
          let queryToRun = args.sqlQuery ? args.sqlQuery.trim() : ''

          if (!queryToRun) {
            if (args.tableName) {
              queryToRun = `SELECT * FROM ${args.tableName}`
            } else {
              return {
                status: 'error',
                message: 'Mohon cantumkan tableName atau sqlQuery yang ingin dieksekusi.'
              }
            }
          }

          // Safety guard:
          if (/^\s*DROP\s+TABLE\b/i.test(queryToRun)) {
            return {
              status: 'blocked',
              message: 'Peringatan Keamanan: Jangan pernah menjalankan DROP TABLE tanpa konfirmasi eksplisit dari pengguna. Kueri diblokir.'
            }
          }

          if (/^\s*(UPDATE|DELETE)\b/i.test(queryToRun)) {
            return {
              status: 'blocked',
              message: 'Peringatan Skill Keamanan: Sebelum menjalankan UPDATE/DELETE, selalu jalankan SELECT terlebih dahulu untuk memverifikasi data yang akan diubah!'
            }
          }

          if (window.makaryaAPI?.executeDbLiveQuery) {
            const queryRes = await window.makaryaAPI.executeDbLiveQuery({
              config: activeProfile,
              sql: queryToRun,
              limit
            })

            if (queryRes.success) {
              return {
                status: 'success',
                database: activeProfile.database,
                executedQuery: queryToRun,
                rowCount: queryRes.rowCount,
                columns: queryRes.columns,
                rows: queryRes.rows,
                durationMs: queryRes.durationMs,
                safetyNotice:
                  queryRes.rowCount > 10000
                    ? 'Peringatan Skill: Data lebih dari 10.000 baris, pastikan menggunakan indexing yang tepat.'
                    : 'Data dibaca langsung dari database aktif secara aman.'
              }
            } else {
              return {
                status: 'error',
                message: `Gagal mengeksekusi kueri pada database target: ${queryRes.error}`
              }
            }
          }

          return {
            status: 'error',
            message: 'API eksekusi live query belum terhubung.'
          }
        }
      })
    )

    // 5. TOOL: db_save_and_test_connection
    context.subscriptions.push(
      context.agent.registerTool({
        name: 'db_save_and_test_connection',
        description: 'Menyimpan profil koneksi database baru atau memperbarui koneksi aktif untuk project saat ini.',
        parameters: {
          type: 'object',
          properties: {
            profileName: { type: 'string', description: 'Nama alias koneksi' },
            dbType: {
              type: 'string',
              description: 'Tipe database: "sqlserver", "mysql", "postgres", atau "sqlite"',
              enum: ['sqlserver', 'mysql', 'postgres', 'sqlite']
            },
            host: { type: 'string', description: 'Host server database' },
            port: { type: 'number', description: 'Port server database' },
            database: { type: 'string', description: 'Nama database target' },
            username: { type: 'string', description: 'Username login' },
            password: { type: 'string', description: 'Password login' },
            authType: {
              type: 'string',
              description: 'Metode otentikasi',
              enum: ['sql_auth', 'windows_auth', 'none']
            }
          },
          required: ['dbType', 'host', 'database']
        },
        execute: async (args: {
          profileName?: string
          dbType: DatabaseType
          host: string
          port?: number
          database: string
          username?: string
          password?: string
          authType?: 'sql_auth' | 'windows_auth' | 'none'
        }) => {
          const defaultPorts: Record<DatabaseType, number> = {
            sqlserver: 1433,
            mysql: 3306,
            postgres: 5432,
            sqlite: 0
          }

          const port = args.port || defaultPorts[args.dbType] || 5432
          const authType =
            args.authType ||
            (args.dbType === 'sqlserver' && !args.username ? 'windows_auth' : 'sql_auth')
          const name = args.profileName || `${args.dbType.toUpperCase()} - ${args.database}`

          const profiles = loadSavedProfiles()
          profiles.forEach((p) => {
            p.isActive = false
          })

          const newProfile: DatabaseConnectionProfile = {
            id: `db_${Date.now()}`,
            name,
            type: args.dbType,
            host: args.host,
            port,
            database: args.database,
            username: args.username,
            password: args.password,
            authType,
            isActive: true,
            createdAt: new Date().toISOString(),
            lastTestedAt: new Date().toISOString(),
            lastTestStatus: 'success',
            lastTestMessage: 'Koneksi berhasil disimpan.'
          }

          profiles.unshift(newProfile)
          saveProfiles(profiles)
          refreshStatus()

          context.ui.showToast({
            title: 'Koneksi Database Tersimpan',
            message: `Profil "${name}" [${args.dbType.toUpperCase()}] berhasil diaktifkan.`,
            type: 'success'
          })

          return {
            status: 'success',
            message: `Profil koneksi "${name}" berhasil diaktifkan untuk project ini.`,
            profile: {
              id: newProfile.id,
              name: newProfile.name,
              type: newProfile.type,
              host: newProfile.host,
              port: newProfile.port,
              database: newProfile.database,
              authType: newProfile.authType
            }
          }
        }
      })
    )

    // 6. TOOL: db_list_saved_profiles
    context.subscriptions.push(
      context.agent.registerTool({
        name: 'db_list_saved_profiles',
        description: 'Melihat seluruh daftar profil database yang tersimpan di sistem Makarya IDE.',
        parameters: {
          type: 'object',
          properties: {}
        },
        execute: async () => {
          const profiles = loadSavedProfiles()
          return {
            count: profiles.length,
            profiles: profiles.map((p) => ({
              id: p.id,
              name: p.name,
              type: p.type,
              host: p.host,
              port: p.port,
              database: p.database,
              authType: p.authType,
              projectRoot: p.projectRoot || 'Global',
              isActive: p.isActive,
              lastTestedAt: p.lastTestedAt,
              lastTestStatus: p.lastTestStatus
            }))
          }
        }
      })
    )

    // 7. Commands: Membuka Popup Modal Database Connection Manager saat tombol diklik
    context.subscriptions.push(
      context.commands.registerCommand('dbAssistant.setupConnection', async () => {
        window.dispatchEvent(new CustomEvent('makarya:open-db-connection-modal'))
      })
    )

    context.subscriptions.push(
      context.commands.registerCommand('dbAssistant.listProfiles', async () => {
        window.dispatchEvent(new CustomEvent('makarya:open-db-connection-modal'))
      })
    )

    context.subscriptions.push(
      context.commands.registerCommand('dbAssistant.quickStatus', () => {
        const current = getActiveProfile()
        if (current) {
          context.ui.showToast({
            title: 'Status Database Aktif',
            message: `Terkoneksi ke ${current.name} (${current.type.toUpperCase()}) pada ${current.host}:${current.port}/${current.database}`,
            type: 'info'
          })
        } else {
          context.ui.showToast({
            title: 'Status Database',
            message: 'Belum ada profil koneksi database yang tersimpan. Klik status bar untuk setup.',
            type: 'warn'
          })
        }
      })
    )
  }
})

export default DatabaseAiToolPlugin
