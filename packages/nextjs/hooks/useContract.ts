import { ethers } from "ethers";
import contract from "../contracts/contract.json";

export function useContract(
  chainId: string,
  signerOrProvider: ethers.Signer | ethers.BrowserProvider,
) {
  const address = (contract as any)[chainId].address;
  if (!address) throw new Error("Contract not deployed for this chainId (");
  return new ethers.Contract(address, (contract as any)[chainId].abi, signerOrProvider);
}
