import { HttpProvider } from "@platonnetwork/web3-providers-http";
import { IpcProvider } from "@platonnetwork/web3-providers-ipc";
import { WebsocketProvider } from "@platonnetwork/web3-providers-ws";

export type Provider = HttpProvider | IpcProvider | WebsocketProvider;

export interface JsonRpcResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: string;
}

export interface Callback<ResultType> {
  (error: Error): void;
  (error: null, val: ResultType): void;
}
