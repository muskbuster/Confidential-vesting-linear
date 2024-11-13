
# Hardhat Template [![Open in Gitpod][gitpod-badge]][gitpod] [![Hardhat][hardhat-badge]][hardhat] [![License: MIT][license-badge]][license]

[gitpod]: https://gitpod.io/#https://github.com/Inco-fhevm/fhevm-hardhat-template-rivest  
[gitpod-badge]: https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-FFB45B?logo=gitpod  
[gha]: https://github.com/Inco-fhevm/fhevm-hardhat-template-rivest/actions    
[hardhat]: https://hardhat.org/  
[hardhat-badge]: https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C.svg  
[license]: https://opensource.org/licenses/MIT  
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg  

A Hardhat-based template for developing Solidity smart contracts, complete with sensible defaults.

- **Hardhat**: Compile, run, and test smart contracts.
- **TypeChain**: Generate TypeScript bindings for smart contracts.
- **Ethers**: Trusted Ethereum library and wallet implementation.
- **Solhint**: Solidity code linter.
- **Solcover**: Code coverage tool.
- **Prettier Plugin Solidity**: Code formatter.

## Getting Started

Click the [`Use this template`](https://github.com/Inco-fhevm/fhevm-hardhat-template-rivest/generate) button to create a new repository from this template.

## Confidential Vesting 

This is a basic modification of Sablier's Linear-streaming-contract to enable creation of confidential streams between users.
It uses Inco's FHE stack to encrypt and store ciphertexts. And this can be directly done via smart contracts using the TFHE library. 

![image](https://github.com/user-attachments/assets/3b6cc29b-46e8-47fe-aa34-15f797449154)


Currently Enables
- Hidden stream amounts 
- Hidden token transfer using CERC20
- Hidden creation Date 

We can further encrypt addresses and the duration parameters.This  implementation is to demonstrate a more balanced approach for privacy with transparancy.

Modified Contracts 
- SablierV2Lockup.sol
- Datatypes.sol
- SablierV2LockupLinear.sol

Learn More about Inco and FHE [here](https://docs.inco.org)
## Usage

### Prerequisites

Install [pnpm](https://pnpm.io/installation). To get started, create a `.env` file and set a BIP-39 compatible mnemonic as an environment variable.

```sh
cp .env.example .env
```

If you don’t have a mnemonic, generate one [here](https://iancoleman.io/bip39/).

Next, install dependencies (requires Node v20 or newer):

```sh
pnpm install
```

### Development on Rivest Testnet

Run the pre-launch script to set up the environment:

```sh
sh pre-launch.sh
```

This generates necessary precompile ABI files. 

Compile contracts with Hardhat:

```sh
pnpm compile
```

Deploy contracts on the Rivest network:

```sh
pnpm deploy:contracts --network rivest
```

Run tests on the Rivest network:

```sh
pnpm test:rivest
```

### Development on Local Docker Setup

Install [Docker](https://docs.docker.com/engine/install/).

Start fhEVM
During installation (see previous section) we recommend you for easier setup to not change the default .env : simply copy the original .env.example file to a new .env file in the root of the repo.

Then, start a local fhEVM docker compose that inlcudes everything needed to deploy FHE encrypted smart contracts using:

```sh
pnpm fhevm:start
```

The initial setup takes 2–3 minutes. Wait until blockchain logs appear to confirm completion.

Run tests in a new terminal:

```sh
pnpm test
```

Stop the node after testing:

```sh
pnpm fhevm:stop
```

Clean up artifacts, coverage reports, and cache:

```sh
pnpm clean
```



## Resources

- **Block Explorer**: [https://explorer.rivest.inco.org/](https://explorer.rivest.inco.org/)
- **Faucet**: [https://faucet.rivest.inco.org/](https://faucet.rivest.inco.org/)
- **RPC Endpoint**: [https://validator.rivest.inco.org](https://validator.rivest.inco.org)
- **Gateway Endpoint**: [https://gateway.rivest.inco.org](https://gateway.rivest.inco.org)

