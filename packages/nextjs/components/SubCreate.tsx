import { Bee } from "@ethersphere/bee-js";
import { timeDecider } from "./Utils";
import { ContractFunctionExecutionError, parseEther } from "viem";

export const subCreate = async (
  title: string,
  timeMult: string,
  project_id: string,
  description: string,
  price: string,
  timeSpan: number,
  write: (...overrideArgs: unknown[]) => Promise<unknown>,
  storage: Bee | undefined,
  storageStamp: string
) => {
  const writeProjectDetailsToStorage = async function () {
    const calculatedTime = timeDecider(timeMult, timeSpan);
    const res = await storage?.uploadData(
      storageStamp,
      JSON.stringify({
        title,
        description,
        short_description: description.slice(0, 500),
        price,
        timeSpan: calculatedTime,
      }),
    );

    const id = res?.reference.toString();
    write({ args: [project_id, id, parseEther(price), timeSpan] });
  };
  if (project_id) {
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