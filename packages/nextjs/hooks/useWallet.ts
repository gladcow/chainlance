import { useEffect, useState } from "react";
import { BrowserProvider, type Signer } from "ethers";
import { switchToGnosis } from "./switchToGnosis";

export function useWallet() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [address, setAddress] = useState<string | undefined>();
  const [chainId, setChainId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined" || !window.ethereum) return;
      const browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      // проверка сети + автопереключение
      await switchToGnosis(browserProvider);

      const networkInfo = await browserProvider.getNetwork();
      setChainId(networkInfo.chainId.toString());

      try {
        const signerInstance = await browserProvider.getSigner();
        const userAddress = await signerInstance.getAddress();
        setSigner(signerInstance);
        setAddress(userAddress);
      } catch {
        // пользователь ещё не подключил аккаунт
      }
    };

    init();

    // window.ethereum.on("accountsChanged", () => window.location.reload());
    // window.ethereum.on("chainChanged", () => window.location.reload());
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
