import type { Disposable, MakaryaPlugin } from './types'

/**
 * Helper to define a Makarya IDE plugin with complete type safety.
 */
export function definePlugin(plugin: MakaryaPlugin): MakaryaPlugin {
  return plugin
}

/**
 * Creates a disposable wrapper around a cleanup function.
 */
export function createDisposable(disposeFn: () => void): Disposable {
  let isDisposed = false
  return {
    dispose: () => {
      if (!isDisposed) {
        isDisposed = true
        disposeFn()
      }
    }
  }
}
