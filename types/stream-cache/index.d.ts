/* eslint-disable */

// Type definitions for stream-cache 0.0.3
// Project: https://github.com/felixge/node-stream-cache
// Definitions by: Colton Loewen <https://github.com/cloewen8>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="./node" />

import { Duplex } from "stream";

export as namespace StreamCache;

export = StreamCache;

declare class StreamCache extends Duplex {
  constructor()
  getLength(): number
}
