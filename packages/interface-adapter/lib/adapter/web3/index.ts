import { Web3Shim } from "../../shim";
import { TransactionConfig as EvmTransactionConfig } from "@alayanetwork/web3-core";
import { InterfaceAdapter, EvmBlockType } from "../types";
import { Provider } from "@truffle/provider";

export interface Web3InterfaceAdapterOptions {
  provider?: Provider;
  networkType?: string;
}

export class Web3InterfaceAdapter implements InterfaceAdapter {
  public web3: Web3Shim;

  constructor({ provider, networkType }: Web3InterfaceAdapterOptions = {}) {
    this.web3 = new Web3Shim({ provider, networkType });
  }

  public getNetworkId() {
    return this.web3.platon.net.getId();
  }

  public getBlock(block: EvmBlockType) {
    return this.web3.platon.getBlock(block);
  }

  public getTransaction(tx: string) {
    return this.web3.platon.getTransaction(tx);
  }

  public getTransactionReceipt(tx: string) {
    return this.web3.platon.getTransactionReceipt(tx);
  }

  public getBalance(address: string) {
    return this.web3.platon.getBalance(address);
  }

  public getCode(address: string) {
    return this.web3.platon.getCode(address);
  }

  public getAccounts() {
    return this.web3.platon.getAccounts();
  }

  public estimateGas(transactionConfig: EvmTransactionConfig) {
    return this.web3.platon.estimateGas(transactionConfig);
  }

  public getBlockNumber() {
    return this.web3.platon.getBlockNumber();
  }
}
