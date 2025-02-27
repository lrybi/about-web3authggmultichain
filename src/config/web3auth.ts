import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, UX_MODE, Web3AuthNoModalOptions } from "@web3auth/base";
import { AuthAdapterOptions } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = "BCx5UY9LtuNMxzW1IwGo8xW2o6wzDGkVDYmN725HJ01TPM8tXkjKM2ahBIatINZHtsT4iFTquCOOMMcwAsBuNRA"; // get from https://dashboard.web3auth.io

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum Sepolia",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

export const web3AuthConfig: Web3AuthNoModalOptions = {
    clientId,
  privateKeyProvider,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
};


export const authAdapterConfig: AuthAdapterOptions ={
    adapterSettings: {
      uxMode: UX_MODE.REDIRECT,
    },
  };
