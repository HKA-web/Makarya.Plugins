# Antigravity Autonomous Agent (`agy`) Plugin for Makarya IDE

Paket lengkap plugin agen pemrograman otonom bertenaga Antigravity CLI (`agy`) dari Google Deepmind.

## Struktur Modul
- `src/index.ts`: Definisi Plugin Manifest, Lifecycle `activate`/`deactivate`, dan ekspor komponen.
- `src/components/AntigravityPanel.vue`: Antarmuka utama Agent Panel (live thought tokens, tool executions, approval cards).
- `src/components/AntigravityModelModal.vue`: Modal interaktif pemilihan model AI (Gemini Flash/Pro, Claude, GPT-OSS).
- `src/components/AntigravitySessionModal.vue`: Modal riwayat percakapan yang terintegrasi dengan Antigravity Brain (`~/.gemini/antigravity-cli/brain/`).
- `src/stores/antigravityStore.ts`: Manajemen state percakapan, token streaming, dan IPC listeners.
- `src/assets/antigravity-logo.svg`: Ikon & logo resmi Antigravity.
