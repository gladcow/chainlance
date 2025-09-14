import { useEffect, useState, useCallback } from "react";
import { BrowserProvider, type Signer } from "ethers";
import type { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export function useWallet() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [address, setAddress] = useState<string | undefined>();
  const [chainId, setChainId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) {
      console.log("No MetaMask");
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    setProvider(provider);
  }, []);

  const refreshWalletState = useCallback(
    async (prov: BrowserProvider) => {
      try {
        const network = await prov.getNetwork();
        setChainId(network.chainId.toString());

        try {
          const signerInstance = await prov.getSigner();
          setSigner(signerInstance);
          setAddress(await signerInstance.getAddress());
        } catch {

          setSigner(null);
          setAddress(undefined);
        }
      } catch (err) {
        console.error("Error with updating wallet:", err);
      }
    },
    []
  );

  const connect = async () => {
    if (!provider) return;
    await provider.send("eth_requestAccounts", []);
    await refreshWalletState(provider);
  };

const switchNetwork = async () => {
  if (!provider) return;
  try {
    await provider.send("wallet_switchEthereumChain", [{ chainId: "0x64" }]);
  } catch (err: any) {
    console.warn("Switch error:", err);

    if (err.code === 4902 || err.code === "UNKNOWN_ERROR") {
      try {
        await provider.send("wallet_addEthereumChain", [
          {
            chainId: "0x64",
            chainName: "Gnosis Chain",
            nativeCurrency: {
              name: "xDAI",
              symbol: "xDAI",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.gnosischain.com/"],
            blockExplorerUrls: ["https://gnosisscan.io/"],
          },
        ]);

        try {
          await provider.send("wallet_switchEthereumChain", [
            { chainId: "0x64" },
          ]);
        } catch (switchErr) {
          console.error("Повторное переключение не удалось:", switchErr);
        }
      } catch (addErr) {
        console.error("Ошибка при добавлении сети:", addErr);
      }
    } else {
      console.error("Ошибка переключения сети:", err);
    }
  }
};


  useEffect(() => {
    if (!provider || typeof window === "undefined" || !window.ethereum) return;

    const eth = window.ethereum;
    const handleAccountsChanged = () => refreshWalletState(provider);

    const handleChainChanged = (...args: unknown[]) => {
      const chainIdHex = args[0] as string;
      const id = parseInt(chainIdHex, 16).toString();
      setChainId(id);

      refreshWalletState(provider);
    };

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    refreshWalletState(provider);

    return () => {
      eth.removeListener("accountsChanged", handleAccountsChanged);
      eth.removeListener("chainChanged", handleChainChanged);
    };
  }, [provider, refreshWalletState]);


  return { provider, signer, address, chainId, connect, switchNetwork };
}
