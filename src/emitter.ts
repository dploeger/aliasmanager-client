import mitt, { Emitter } from 'mitt';

let emitter: Emitter | null = null;

export function getEmitter(): Emitter {
  if (!emitter) {
    emitter = mitt();
  }
  return emitter;
}
