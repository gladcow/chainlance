import { useEffect, useState } from "react";
import { CID, KuboRPCClient } from "kubo-rpc-client";

interface ProjectTitleFromIdProps {
  ipfsNode: KuboRPCClient | undefined;
  projectId: string;
}

export const ProjectTitleFromId = ({ ipfsNode, projectId }: ProjectTitleFromIdProps) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    const init = async () => {
      if (title.length > 0) return;
      if (!(await ipfsNode?.isOnline())) return;
      const cid = CID.parse(projectId);
      const data = ipfsNode?.get(cid);
      if (data === undefined) {
        return;
      }
      let resString = "";
      for await (const x of data) {
        const chunk = new TextDecoder().decode(x);
        resString += chunk;
      }
      // dirty hack
      const bodyString = resString.substring(resString.indexOf("{", 0), resString.lastIndexOf("}") + 1);
      const parsedData = JSON.parse(bodyString);
      // @ts-ignore
      setTitle(parsedData.title);
    };
    init();
  }, [title, ipfsNode, projectId]);
  return title;
};
