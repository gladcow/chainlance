import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [currentValue, setCurrentValue] = useState<string>("-");
  const [inputValue, setInputValue] = useState("");

useEffect(() => {
  async function init() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);
        const _signer = await _provider.getSigner();
        setSigner(_signer);
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);
        setContract(_contract);
      } catch (error) {
        console.error("Ошибка инициализации ethers:", error);
      }
    } else {
      console.warn("window.ethereum не найден");
    }
  }
  init();
}, []);


  const connectWallet = async () => {
    if (!provider) return alert("Metamask не найден");
    await provider.send("eth_requestAccounts", []);
    const _signer = await provider.getSigner();
    setSigner(_signer);
    const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);
    setContract(_contract);
    console.log(contract)
  };

  const readFromContract = async () => {
    if (!contract) return;
    const value = await contract.number();
    setCurrentValue(value.toString());
  };

  const writeToContract = async () => {
    if (!contract) return;
    const tx = await contract.setNumber(Number(inputValue));
    await tx.wait();
    readFromContract();
  };

  return (
    <main style={{ padding: 24 }}>
      <button onClick={connectWallet}>Подключить Metamask</button>

      <div style={{ marginTop: 20 }}>
        <button onClick={readFromContract}>Прочитать значение</button>
        <p>Текущее значение: {currentValue}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Новое число"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={writeToContract}>Отправить</button>
      </div>
    </main>
  );
}
