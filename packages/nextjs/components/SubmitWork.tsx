import { ContractFunctionExecutionError } from "viem";

export const submitWork = async (project_id: string, writeAsync: any) => {
  const writeProjectDetailsToStorage = async function () {
    writeAsync({ args: [project_id] });
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
