import { useState, useCallback, useMemo } from "react";
import { useWallet } from "./useWallet";
import { useContract } from "./useContract";

export function useContractWrite({
  functionName,
  args = [],
  overrides = {},
  enabled = true,
}: {
  functionName: string;
  args?: any[];
  overrides?: Record<string, any>;
  enabled?: boolean;
}) {
  const { signer, chainId } = useWallet();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const contract = useMemo(() => {
    if (!signer || !chainId || !enabled) return null;
    return useContract(chainId, signer);
  }, [signer, chainId, enabled]);

  const write = useCallback(
    async (...overrideArgs: any[]) => {
      if (!contract) throw new Error("Contract not ready");
      setLoading(true);
      setError(null);
      try {
        let finalArgs = overrideArgs.length > 0 ? overrideArgs : args;

        let callOverrides = overrides;
        if (
          finalArgs.length > 0 &&
          typeof finalArgs[finalArgs.length - 1] === "object" &&
          !Array.isArray(finalArgs[finalArgs.length - 1])
        ) {
          callOverrides = finalArgs.pop();
        }

        const tx = await contract[functionName](...finalArgs, callOverrides);
        setTxHash(tx.hash);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contract, functionName, JSON.stringify(args), JSON.stringify(overrides)]
  );

  return { write, loading, txHash, error };
}
