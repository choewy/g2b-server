/* eslint-disable @typescript-eslint/no-unused-vars */

import { OutgoingHttpHeaders, OutgoingHttpHeader } from 'http';
import { Socket } from 'net';
import { EventEmitter, Readable } from 'stream';

import { Response } from 'express';
import {
  Application,
  CookieOptions,
  DownloadOptions,
  Errback,
  Locals,
  ParamsDictionary,
  Request,
  Send,
  SendFileOptions,
} from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export class MockResponse implements Response {
  status(code: number): this {
    return this;
  }
  sendStatus(code: number): this {
    return this;
  }
  links(links: any): this {
    return this;
  }
  send: Send<any, this>;
  json: Send<any, this>;
  jsonp: Send<any, this>;
  sendFile(path: string, fn?: Errback): void;
  sendFile(path: string, options: SendFileOptions, fn?: Errback): void;
  sendFile(path: unknown, options?: unknown, fn?: unknown): void {
    return;
  }
  sendfile(path: string): void;
  sendfile(path: string, options: SendFileOptions): void;
  sendfile(path: string, fn: Errback): void;
  sendfile(path: string, options: SendFileOptions, fn: Errback): void;
  sendfile(path: unknown, options?: unknown, fn?: unknown): void {
    return;
  }
  download(path: string, fn?: Errback): void;
  download(path: string, filename: string, fn?: Errback): void;
  download(path: string, filename: string, options: DownloadOptions, fn?: Errback): void;
  download(path: unknown, filename?: unknown, options?: unknown, fn?: unknown): void {
    return;
  }
  contentType(type: string): this {
    return this;
  }
  type(type: string): this {
    return this;
  }
  format(obj: any): this {
    return this;
  }
  attachment(filename?: string): this {
    return this;
  }
  set(field: any): this;
  set(field: string, value?: string | string[]): this;
  set(field: unknown, value?: unknown): this {
    return this;
  }
  header(field: any): this;
  header(field: string, value?: string | string[]): this;
  header(field: unknown, value?: unknown): this {
    return this;
  }
  headersSent: boolean;
  get(field: string): string {
    return '';
  }
  clearCookie(name: string, options?: CookieOptions): this {
    return this;
  }
  cookie(name: string, val: string, options: CookieOptions): this;
  cookie(name: string, val: any, options: CookieOptions): this;
  cookie(name: string, val: any): this;
  cookie(name: unknown, val: unknown, options?: unknown): this {
    return this;
  }
  location(url: string): this {
    return this;
  }
  redirect(url: string): void;
  redirect(status: number, url: string): void;
  redirect(url: string, status: number): void;
  redirect(url: unknown, status?: unknown): void {
    return;
  }
  render(view: string, options?: object, callback?: (err: Error, html: string) => void): void;
  render(view: string, callback?: (err: Error, html: string) => void): void;
  render(view: unknown, options?: unknown, callback?: unknown): void {
    return;
  }
  locals: Record<string, any> & Locals;
  charset: string;
  vary(field: string): this {
    return this;
  }
  app: Application<Record<string, any>>;
  append(field: string, value?: string | string[]): this {
    return this;
  }
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
  statusCode: number;
  statusMessage: string;
  strictContentLength: boolean;
  assignSocket(socket: Socket): void {
    return;
  }
  detachSocket(socket: Socket): void {
    return;
  }
  writeContinue(callback?: () => void): void {
    return;
  }
  writeEarlyHints(hints: Record<string, string | string[]>, callback?: () => void): void {
    return;
  }
  writeHead(statusCode: number, statusMessage?: string, headers?: OutgoingHttpHeaders | OutgoingHttpHeader[]): this;
  writeHead(statusCode: number, headers?: OutgoingHttpHeaders | OutgoingHttpHeader[]): this;
  writeHead(statusCode: unknown, statusMessage?: unknown, headers?: unknown): this {
    return this;
  }
  writeProcessing(): void {
    return;
  }
  chunkedEncoding: boolean;
  shouldKeepAlive: boolean;
  useChunkedEncodingByDefault: boolean;
  sendDate: boolean;
  finished: boolean;
  connection: Socket;
  socket: Socket;
  setTimeout(msecs: number, callback?: () => void): this {
    return this;
  }
  setHeader(name: string, value: string | number | readonly string[]): this {
    return this;
  }
  appendHeader(name: string, value: string | readonly string[]): this {
    return this;
  }
  getHeader(name: string): string | number | string[] {
    return [];
  }
  getHeaders(): OutgoingHttpHeaders {
    return {};
  }
  getHeaderNames(): string[] {
    return [];
  }
  hasHeader(name: string): boolean {
    return true;
  }
  removeHeader(name: string): void {
    return;
  }
  addTrailers(headers: OutgoingHttpHeaders | readonly [string, string][]): void {
    return;
  }
  flushHeaders(): void {
    return;
  }
  writable: boolean;
  writableEnded: boolean;
  writableFinished: boolean;
  writableHighWaterMark: number;
  writableLength: number;
  writableObjectMode: boolean;
  writableCorked: number;
  destroyed: boolean;
  closed: boolean;
  errored: Error;
  writableNeedDrain: boolean;
  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error) => void): void {
    throw new Error('Method not implemented.');
  }
  _writev?(chunks: { chunk: any; encoding: BufferEncoding }[], callback: (error?: Error) => void): void {
    throw new Error('Method not implemented.');
  }
  _construct?(callback: (error?: Error) => void): void {
    throw new Error('Method not implemented.');
  }
  _destroy(error: Error, callback: (error?: Error) => void): void {
    throw new Error('Method not implemented.');
  }
  _final(callback: (error?: Error) => void): void {
    throw new Error('Method not implemented.');
  }
  write(chunk: any, callback?: (error: Error) => void): boolean;
  write(chunk: any, encoding: BufferEncoding, callback?: (error: Error) => void): boolean;
  write(chunk: unknown, encoding?: unknown, callback?: unknown): boolean {
    throw new Error('Method not implemented.');
  }
  setDefaultEncoding(encoding: BufferEncoding): this {
    throw new Error('Method not implemented.');
  }
  end(cb?: () => void): this;
  end(chunk: any, cb?: () => void): this;
  end(chunk: any, encoding: BufferEncoding, cb?: () => void): this;
  end(chunk?: unknown, encoding?: unknown, cb?: unknown): this {
    throw new Error('Method not implemented.');
  }
  cork(): void {
    throw new Error('Method not implemented.');
  }
  uncork(): void {
    throw new Error('Method not implemented.');
  }
  destroy(error?: Error): this {
    throw new Error('Method not implemented.');
  }
  addListener(event: 'close', listener: () => void): this;
  addListener(event: 'drain', listener: () => void): this;
  addListener(event: 'error', listener: (err: Error) => void): this;
  addListener(event: 'finish', listener: () => void): this;
  addListener(event: 'pipe', listener: (src: Readable) => void): this;
  addListener(event: 'unpipe', listener: (src: Readable) => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;
  addListener(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  emit(event: 'close'): boolean;
  emit(event: 'drain'): boolean;
  emit(event: 'error', err: Error): boolean;
  emit(event: 'finish'): boolean;
  emit(event: 'pipe', src: Readable): boolean;
  emit(event: 'unpipe', src: Readable): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;
  emit(event: unknown, src?: unknown, ...rest: unknown[]): boolean {
    throw new Error('Method not implemented.');
  }
  on(event: 'close', listener: () => void): this;
  on(event: 'drain', listener: () => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'finish', listener: () => void): this;
  on(event: 'pipe', listener: (src: Readable) => void): this;
  on(event: 'unpipe', listener: (src: Readable) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  on(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  once(event: 'close', listener: () => void): this;
  once(event: 'drain', listener: () => void): this;
  once(event: 'error', listener: (err: Error) => void): this;
  once(event: 'finish', listener: () => void): this;
  once(event: 'pipe', listener: (src: Readable) => void): this;
  once(event: 'unpipe', listener: (src: Readable) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;
  once(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  prependListener(event: 'close', listener: () => void): this;
  prependListener(event: 'drain', listener: () => void): this;
  prependListener(event: 'error', listener: (err: Error) => void): this;
  prependListener(event: 'finish', listener: () => void): this;
  prependListener(event: 'pipe', listener: (src: Readable) => void): this;
  prependListener(event: 'unpipe', listener: (src: Readable) => void): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
  prependListener(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  prependOnceListener(event: 'close', listener: () => void): this;
  prependOnceListener(event: 'drain', listener: () => void): this;
  prependOnceListener(event: 'error', listener: (err: Error) => void): this;
  prependOnceListener(event: 'finish', listener: () => void): this;
  prependOnceListener(event: 'pipe', listener: (src: Readable) => void): this;
  prependOnceListener(event: 'unpipe', listener: (src: Readable) => void): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
  prependOnceListener(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  removeListener(event: 'close', listener: () => void): this;
  removeListener(event: 'drain', listener: () => void): this;
  removeListener(event: 'error', listener: (err: Error) => void): this;
  removeListener(event: 'finish', listener: () => void): this;
  removeListener(event: 'pipe', listener: (src: Readable) => void): this;
  removeListener(event: 'unpipe', listener: (src: Readable) => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(event: unknown, listener: unknown): this {
    throw new Error('Method not implemented.');
  }
  pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean }): T {
    throw new Error('Method not implemented.');
  }
  compose<T extends NodeJS.ReadableStream>(
    stream: T | ((source: any) => void) | Iterable<T> | AsyncIterable<T>,
    options?: { signal: AbortSignal },
  ): T {
    throw new Error('Method not implemented.');
  }
  [EventEmitter.captureRejectionSymbol]?<K>(error: Error, event: string | symbol, ...args: any[]): void {
    throw new Error('Method not implemented.');
  }
  off<K>(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return this;
  }
  removeAllListeners(event?: string | symbol): this {
    return this;
  }
  setMaxListeners(n: number): this {
    return this;
  }
  getMaxListeners(): number {
    return 0;
  }
  listeners<K>(eventName: string | symbol): Array<(...args: any[]) => void | Promise<void>> {
    return [];
  }
  rawListeners<K>(eventName: string | symbol): Array<(...args: any[]) => void | Promise<void>> {
    return [];
  }
  listenerCount<K>(eventName: string | symbol, listener?: (...args: any[]) => void | Promise<void>): number {
    return 0;
  }
  eventNames(): (string | symbol)[] {
    return [];
  }
}
