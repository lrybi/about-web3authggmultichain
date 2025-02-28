'use client'

import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter, AuthAdapterOptions } from "@web3auth/auth-adapter";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, UX_MODE, Web3AuthNoModalOptions, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import "../App.css";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

//import { web3AuthConfig, authAdapterConfig } from "../config/web3auth";
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
  

import type { NextPage } from "next";

// EVM
import Web3 from "web3";

import StartkNetRPC from "../RPC/startkNetRPC"; // for using starkex
import EthereumRPC from "../RPC/ethRPC-web3"; // for using web3.js
import SolanaRPC from "../RPC/solanaRPC"; // for using solana
import TezosRPC from "../RPC/tezosRPC"; // for using tezos
import PolkadotRPC from "../RPC/polkadotRPC"; // for using polkadot
import NearRPC from "../RPC/nearRPC";

//const Home: NextPage = () => {
const App: NextPage = () => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false);
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
        const web3AuthConfig: Web3AuthNoModalOptions = {
          clientId,
          privateKeyProvider,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        };
        const web3auth = new Web3AuthNoModal(web3AuthConfig);
        setWeb3auth(web3auth);

        const authAdapterConfig: AuthAdapterOptions ={
          adapterSettings: {
            uxMode: UX_MODE.REDIRECT,
          },
        };
        const authAdapter = new AuthAdapter(authAdapterConfig);

        web3auth.configureAdapter(authAdapter);

        await web3auth.init();

        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const getAllAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // EVM chains
    // const polygon_address = await getPolygonAddress();
    // const bnb_address = await getBnbAddress();

    const rpcETH = new EthereumRPC(provider!);
    const privateKey = await rpcETH.getPrivateKey();
    //const privateKey = await ethRPC.getGeneralPrivateKey();

    //const tezosRPC = new TezosRPC(privateKey);
    const solanaRPC = new SolanaRPC(privateKey);
    // const polkadotRPC = new PolkadotRPC(privateKey);
    // const starkNetRPC = new StartkNetRPC(privateKey);
    // const nearRPC = new NearRPC(provider!);

    const eth_address = await rpcETH.getAccounts();
    const solana_address = await solanaRPC.getAccounts();
    // const tezos_address = await tezosRPC.getAccounts();
    // const starknet_address = await starkNetRPC.getAccounts();
    // const polkadot_address = await polkadotRPC.getAccounts();
    // const near_address = await nearRPC.getAccounts();

    uiConsole(
      // "Polygon Address: " + polygon_address,
      // "BNB Address: " + bnb_address,
      "Ethereum Address: " + eth_address,
      "Solana Address: " + solana_address,
      // "Near Address: " + near_address?.["Account ID"],
      // "Tezos Address: " + tezos_address,
      // "StarkNet Address: " + starknet_address,
      // "Polkadot Address: " + polkadot_address
    );
  };

  const getAllBalances = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const ethRPC = new EthereumRPC(provider!);
    const privateKey = await ethRPC.getPrivateKey();
    //const privateKey = await ethRPC.getGeneralPrivateKey();

    //const tezosRPC = new TezosRPC(privateKey);
    const solanaRPC = new SolanaRPC(privateKey);
    //const polkadotRPC = new PolkadotRPC(privateKey);

    const eth_balance = await ethRPC.getBalance();
    const solana_balance = await solanaRPC.getBalance();
    //const tezos_balance = await tezosRPC.getBalance();
    //const polkadot_balance = await polkadotRPC.getBalance();

    uiConsole(
      "Ethereum sepolia Balance: " + eth_balance,
      "Solana devnet Balance: " + solana_balance,
    );
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
    setLoggedIn(true);
    uiConsole("Logged in Successfully!");
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getEthAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const address = await rpc.getAccounts();
    uiConsole("ETH Address: " + address);
  };

  const getSolanaAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const ethRPC = new EthereumRPC(provider!);
    const privateKey = await ethRPC.getPrivateKey();
    //const privateKey = await ethRPC.getGeneralPrivateKey();

    const rpc = new SolanaRPC(privateKey);
    const address = await rpc.getAccounts();
    uiConsole("Solana Address: " + address);
  };

  const getEthPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole("ETH PrivateKey: " + privateKey);
  };
  const getGeneralPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const generalPrivateKey = await rpc.getGeneralPrivateKey();
    uiConsole("General PrivateKey: " + generalPrivateKey);
  };
  const getSolPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const ethRPC = new EthereumRPC(provider!);
    const privateKey = await ethRPC.getPrivateKey();
    //const privateKey = await ethRPC.getGeneralPrivateKey();

    const rpc = new SolanaRPC(privateKey);
    const solPrivateKey = await rpc.getPrivateKey();
    uiConsole("Solana PrivateKey: " + solPrivateKey);
  };

  const getEthBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new EthereumRPC(provider);
    const balance = await rpc.getBalance();
    const finalString = "ETH sepolia Balance: " + balance;
    uiConsole(finalString);
  };
  const getSolanaBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const ethRPC = new EthereumRPC(provider!);
    const privateKey = await ethRPC.getPrivateKey();
    //const privateKey = await ethRPC.getGeneralPrivateKey();

    const rpc = new SolanaRPC(privateKey);
    const balance = await rpc.getBalance();
    const finalString = "Solana devnet Balance: " + balance;
    uiConsole(finalString);
  };

  const sendSepoEthTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };
  const sendSolanaDevTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const ethRPC = new EthereumRPC(provider!);
    const privateKey = await ethRPC.getPrivateKey();
    //const privateKey = await ethRPC.getGeneralPrivateKey();

    const rpc = new SolanaRPC(privateKey);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  // const signMessage = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new EthereumRPC(provider);
  //   const signedMessage = await rpc.signMessage();
  //   uiConsole(signedMessage);
  // };

  // const getPolygonAddress = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new EthereumRPC(provider);
  //   const privateKey = await rpc.getPrivateKey();

  //   const polygonPrivateKeyProvider = new EthereumPrivateKeyProvider({
  //     config: {
  //       chainConfig: {
  //         chainNamespace: CHAIN_NAMESPACES.EIP155,
  //         chainId: "0x13882",
  //         rpcTarget: "https://rpc.ankr.com/polygon_amoy",
  //         displayName: "Polygon Amoy Testnet",
  //         blockExplorerUrl: "https://amoy.polygonscan.com",
  //         ticker: "POL",
  //         tickerName: "Polygon Ecosystem token",
  //         logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  //       },
  //     },
  //   });
  //   await polygonPrivateKeyProvider.setupProvider(privateKey);
  //   const web3 = new Web3(polygonPrivateKeyProvider);
  //   const address = (await web3.eth.getAccounts())[0];
  //   return address;
  // };

  // const getBnbAddress = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new EthereumRPC(provider);
  //   const privateKey = await rpc.getPrivateKey();

  //   const bnbPrivateKeyProvider = new EthereumPrivateKeyProvider({
  //     config: {
  //       chainConfig: {
  //         chainNamespace: CHAIN_NAMESPACES.EIP155,
  //         chainId: "0x38",
  //         rpcTarget: "https://rpc.ankr.com/bsc",
  //         displayName: "Binance SmartChain Mainnet",
  //         blockExplorerUrl: "https://bscscan.com/",
  //         ticker: "BNB",
  //         tickerName: "BNB",
  //         logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  //       },
  //     },
  //   });
  //   await bnbPrivateKeyProvider.setupProvider(privateKey);
  //   const web3 = new Web3(bnbPrivateKeyProvider);
  //   const address = (await web3.eth.getAccounts())[0];
  //   return address;
  // };

  function uiConsole(...args: any[]): void {
    if (typeof document === "undefined") return;
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getAllAccounts} className="card">
            Get All Accounts
          </button>
        </div>
        <div>
          <button onClick={getEthAccounts} className="card">
            Get ETH Account
          </button>
        </div>
        <div>
          <button onClick={getSolanaAccounts} className="card">
            Get Solana Account
          </button>
        </div>

        <div>
          <button onClick={getEthBalance} className="card">
            Get SepoliaETH Balance
          </button>
        </div>
        <div>
          <button onClick={getSolanaBalance} className="card">
            Get SolanaDev Balance
          </button>
        </div>
        <div>
          <button onClick={getAllBalances} className="card">
            Get All Balances
          </button>
        </div>
        <div>
          <button onClick={sendSepoEthTransaction} className="card">
            Send Transaction (sign&send) ETH Sepolia (wait a bit)
          </button>
        </div>
        <div>
          <button onClick={sendSolanaDevTransaction} className="card">
            Send Transaction (sign&send) Solana Devnet
          </button>
        </div>
        {/* <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div> */}


        <div>
          <button onClick={getEthPrivateKey} className="card">
          Get ETH PrivateKey
          </button>
        </div>
        <div>
          <button onClick={getGeneralPrivateKey} className="card">
          Get General PrivateKey
          </button>
        </div>
        <div>
          <button onClick={getSolPrivateKey} className="card">
          Get Solana PrivateKey
          </button>
        </div>


        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        Multi-chain Example
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://explorer.solana.com/?cluster=devnet"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explorer on Solana Devnet
        </a>
        <a
          href="https://sepolia.etherscan.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explorer on Sepolia Etherscan
        </a>
      </footer>
    </div>
  );
}

export default App;
