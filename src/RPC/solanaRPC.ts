// Solana
import { SolanaPrivateKeyProvider, SolanaWallet } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES, CustomChainConfig, IProvider } from "@web3auth/base";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, Keypair, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
// import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";

import IRPC from "./IRPC";
import { getED25519Key } from "@web3auth/auth-adapter";

export default class SolanaRPC implements IRPC {
  private provider: SolanaPrivateKeyProvider;
  private privateKey: string;

  constructor(privateKey: string) {
    this.provider = new SolanaPrivateKeyProvider({
      config: {
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: "https://api.devnet.solana.com",
          displayName: "Solana Devnet",
          blockExplorerUrl: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana Token",
          logo: "",
        },
      },
    });
    this.privateKey = privateKey;
  }

  getChainId(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async getAccounts(): Promise<any> {
    const ed25519key = getED25519Key(this.privateKey).sk.toString("hex");
    // Get user's Solana's public address
    await this.provider.setupProvider(ed25519key);
    const solanaWallet = new SolanaWallet(this.provider as SolanaPrivateKeyProvider);
    const solana_address = await solanaWallet.requestAccounts();
    return solana_address[0];
  }

  async getBalance(): Promise<string> {
    const address = await this.getAccounts();

    const connection = new Connection(this.provider.config.chainConfig.rpcTarget);

    // Fetch the balance for the specified public key
    const balance = await connection.getBalance(new PublicKey(address));

    return balance.toString();
  }


  async sendTransaction(): Promise<any> {
    //throw new Error("Method not implemented.");
    try {

      const ed25519key = getED25519Key(this.privateKey).sk.toString("hex");
      // Get user's Solana's public address
      await this.provider.setupProvider(ed25519key);
      const solanaWallet = new SolanaWallet(this.provider as SolanaPrivateKeyProvider);
      const solana_address = await solanaWallet.requestAccounts();
      const address = solana_address[0];

      const connection = new Connection(this.provider.config.chainConfig.rpcTarget);

      const block = await connection.getLatestBlockhash("finalized");

      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(address),
        toPubkey: new PublicKey(address),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });

      const transaction = new Transaction({
        blockhash: block.blockhash,
        lastValidBlockHeight: block.lastValidBlockHeight,
        feePayer: new PublicKey(address),
      }).add(TransactionInstruction);

      const { signature } = await solanaWallet.signAndSendTransaction(
        transaction
      );

      return signature;
    } catch (error) {
      return error as string;
    }
  }


  signMessage(): Promise<any> {
    throw new Error("Method not implemented.");
  }


  async getPrivateKey(): Promise<any> {
    //throw new Error("Method not implemented.");
    // const privateKey = await this.provider.request({
    //   method: "solanaPrivateKey",
    // });
    const ed25519key = getED25519Key(this.privateKey).sk.toString("hex");

    return ed25519key as string;
  }
}
