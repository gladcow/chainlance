import { BrowserProvider } from "ethers";

export async function switchToGnosis(provider: BrowserProvider) {
  if (!provider) return;

  try {

    const network = await provider.getNetwork();
    if (network.chainId.toString() === "100") {
      return;
    }

    await provider.send("wallet_switchEthereumChain", [
      { chainId: "0x64" }, 
    ]);

    console.log("Переключено на Gnosis");
  } catch (switchError: any) {

    if (switchError.code === 4902) {
      try {
        await provider.send("wallet_addEthereumChain", [
          {
            chainId: "0x64", // 100
            chainName: "Gnosis Chain",
            nativeCurrency: {
              name: "xDAI",
              symbol: "xDAI",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.gnosischain.com"],
            blockExplorerUrls: ["https://gnosisscan.io/"],
          },
        ]);
        console.log("Gnosis добавлен и выбран");
      } catch (addError) {
        console.error("Ошибка при добавлении сети:", addError);
      }
    } else {
      console.error("Ошибка переключения сети:", switchError);
    }
  }
}
