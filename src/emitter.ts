import mitt, { Emitter } from 'mitt';

let emitter: Emitter | null = null;

/**
 * A simple global static event emitter
 */
export function getEmitter(): Emitter {
  if (!emitter) {
    emitter = mitt();
  }
  return emitter;
}
