import { useState, useEffect, useCallback, useMemo } from "react";
import { useWallet } from "./useWallet";
import { useContract } from "./useContract";

export function useContractRead<T>({
  functionName,
  args = [],
  watch = false,
  watchInterval = 5000,
  enabled = true,
}: {
  functionName: string;
  args?: any[];
  watch?: boolean;
  watchInterval?: number;
  enabled?: boolean;
}) {
  const { provider, chainId } = useWallet();
  // console.log(provider, chainId)
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const contract = useMemo(() => {
    if (!provider || !chainId || !enabled) return null;
    return useContract(chainId, provider);
  }, [provider, chainId, enabled]);

  const fetch = useCallback(async () => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const result = await contract[functionName](...args);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [contract, functionName, JSON.stringify(args)]);

  useEffect(() => {
    if (!enabled) return;

    fetch();

    if (watch) {
      const id = setInterval(fetch, watchInterval);
      return () => clearInterval(id);
    }
  }, [fetch, watch, watchInterval, enabled]);

  return { data, loading, error, refetch: fetch };
}
