/** Lazy loader for the Three.js engine chunk (also used to prefetch on hover/focus of the 3D tab). */
type EngineModule = typeof import('../three/engine');
let promise: Promise<EngineModule> | null = null;

export function loadEngine(): Promise<EngineModule> {
  promise ??= import('../three/engine').catch((e) => {
    promise = null;
    throw e;
  });
  return promise;
}

/** WebGL detection without loading three (design-3d.md §6). */
export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
