import { ContractFunctionExecutionError } from "viem";

export const submitWork = async (project_id: string, write: (...overrideArgs: unknown[]) => Promise<unknown>) => {
  const writeProjectDetailsToStorage = async function () {
    write({ args: [project_id] });
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