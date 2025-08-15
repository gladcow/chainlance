import { useEffect, useState } from "react";
import { BrowserProvider, type Signer, type Network } from "ethers";

export function useWallet() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const init = async () => {
      const browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      const networkInfo = await browserProvider.getNetwork();

      setChainId(networkInfo.chainId.toString())

      try {
        const signerInstance = await browserProvider.getSigner();
        const userAddress = await signerInstance.getAddress();
        setSigner(signerInstance);
        setAddress(userAddress);
      } catch {
        // ??????
      }
    };

    init();

    window.ethereum.on("accountsChanged", () => window.location.reload());
    window.ethereum.on("chainChanged", () => window.location.reload());
  }, []);

  const connect = async () => {
    if (!provider) return;
    await provider.send("eth_requestAccounts", []);
    const signerInstance = await provider.getSigner();
    setSigner(signerInstance);
    setAddress(await signerInstance.getAddress());
  };

  return { provider, signer, address, chainId, connect };
}
