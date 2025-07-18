import { timeDecider } from "./utils";
import { ContractFunctionExecutionError, parseEther } from "viem";

export const subCreate = async (
  title: string,
  timeMult: string,
  project_id: string,
  description: string,
  price: string,
  timeSpan: number,
  writeAsync: any,
  storage: any,
) => {
  const writeProjectDetailsToStorage = async function () {
    const calculatedTime = timeDecider(timeMult, timeSpan);
    const res = await storage?.uploadData(
      "f1e4ff753ea1cb923269ed0cda909d13a10d624719edf261e196584e9e764e50",
      JSON.stringify({
        title,
        description,
        short_description: description.slice(0, 500),
        price,
        timeSpan: calculatedTime,
      }),
    );

    const id = res?.reference.toString();
    writeAsync({ args: [project_id, id, parseEther(price), timeSpan] });
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
