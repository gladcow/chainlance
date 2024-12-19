import { ContractFunctionExecutionError } from "viem";

export const placeBid = async (
  project_id: string,
  externalDescription: string,
  timeSpan: number,
  price: bigint,
  writeAsync: any,
  setBidIsBidded: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (writeAsync) {
    try {
      await writeAsync({
        args: [project_id, externalDescription, price, timeSpan],
      });
    } catch (error) {
      if (error instanceof ContractFunctionExecutionError) {
        setBidIsBidded(true);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }
};
