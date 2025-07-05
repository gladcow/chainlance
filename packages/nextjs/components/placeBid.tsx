import { Bee } from "@ethersphere/bee-js";
import { ContractFunctionExecutionError } from "viem";
import { parseEther } from "viem";

export const placeBid = async (
  project_id: string,
  description: string,
  timeSpan: number,
  price: string,
  writeAsync: any,
  storage: Bee | undefined,
) => {
  const writeProjectDetailsToStorage = async function () {
    const res = await storage?.uploadData(
      "f1e4ff753ea1cb923269ed0cda909d13a10d624719edf261e196584e9e764e50",
      JSON.stringify({
        project_id: project_id,
        description: description,
        short_description: description.slice(0, 500),
        price: Number(price),
        timeSpan: timeSpan,
      }),
    );
    const id = res?.reference.toString();
    const price_to_contract = parseEther(price);
    writeAsync({ args: [project_id, id, price_to_contract, timeSpan] });
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
