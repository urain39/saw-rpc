import { JSONRPCHandler, ArgumentsType } from './lib/tinyrpc/index';

export type ARIA2GID = string;

export type ARIA2RESULT<T> = ArgumentsType<JSONRPCHandler> extends [any, ...infer R] ? [T, ...R] : any[];
