import { WalletClient, getPublicClient, getWalletClient } from '@wagmi/core'
import { ethers } from 'ethers'
const { BrowserProvider, FallbackProvider, JsonRpcProvider, JsonRpcSigner }  = ethers
import { type Chain, type Client, type Transport } from 'viem'

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }
  return new JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function getEthersProvider({ chainId }: { chainId?: number } = {}) {
  const client = getPublicClient({ chainId })
  return clientToProvider(client)
}

export async function walletClientToSigner(walletClient: WalletClient) {
  const chainId = await  walletClient.getChainId()
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chainId,
    name: "BSC",
    ensAddress: null,
  }
  const provider = new BrowserProvider(transport, network)
  const signer =  provider.getSigner(account.address)
  return signer
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner({ chainId }: { chainId?: number } = {}) {
  const client = await getWalletClient({ chainId })
  if (!client) return undefined
  return await walletClientToSigner(client)
}