# Networks and APP deployment

Even the smallest project will interact with at the very least two blockchain nodes: One on the developer's machine, and the other representing the network where the developer will eventually deploy their application (such as the main public PlatON network or a private consortium network, for instance). Truffle provides a system for managing the compilation and deployment artifacts for each network, and does so in a way that simplifies final application deployment.

## Configuration

See the [Configuration](../reference/configuration.md#networks) section for more information.

## Specifying a network

Most Truffle commands will behave differently based on the network specified, and will use that network's contracts and configuration. You can specify a network using the `--network` option, like below:

```bash
$ truffle migrate --network live
```

In this example, Truffle will run your migrations on the "live" network, which -- if configured like [the example](../reference/configuration.md#networks) -- is associated with the public PlatON blockchain.

## Specifying a wasm contract
If you want to deploy a specific wasm contract(contract file like contracts/test.cpp), you can use the following command：

```bash
$ truffle migrate --wasm --contract-name test
```

## Build artifacts

As mentioned in the [Compiling contracts](../getting-started/compiling-contracts.md) section, build artifacts are stored in the `./build/contracts` directory as `.json` files. When you compile your contracts or run your migrations using a specific network, Truffle will update those `.json` files so they contain the information related to that network. When those artifacts are used later -- such as within your frontend or application, they'll automatically detect which network the PlatON client is connected to and use the correct contract artifacts accordingly.

## Application deployment

Because the network is auto-detected by the contract artifacts at runtime, this means that you only need to deploy your application or frontend *once*. When you run your application, the running PlatON client will determine which artifacts are used, and this will make your application very flexible.
