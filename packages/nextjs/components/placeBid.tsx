import { Bee } from "@ethersphere/bee-js";
import { ContractFunctionExecutionError } from "viem";

export const placeBid = async (
  project_id: string,
  description: string,
  timeSpan: number,
  price: bigint,
  writeAsync: any,
  storage: Bee | undefined,
) => {
  const writeProjectDetailsToStorage = async function () {
    const res = await storage?.uploadData(
      "f1e4ff753ea1cb923269ed0cda909d13a10d624719edf261e196584e9e764e50",
      JSON.stringify({ project_id: project_id, description: description, price: Number(price), timeSpan: timeSpan }),
    );
    const id = res?.reference.toString();
    writeAsync({ args: [project_id, id, BigInt(price), timeSpan] });
  };
  if (writeAsync) {
    try {
      await writeProjectDetailsToStorage();
    } catch (error) {
      if (error instanceof ContractFunctionExecutionError) {
        //
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }
};
