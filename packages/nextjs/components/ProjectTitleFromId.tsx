import { useEffect, useState } from "react";
import { json } from "@helia/json";
import { CID } from "multiformats";

interface ProjectTitleFromIdProps {
  helia: any;
  heliaOnline: boolean;
  projectId: string;
}

export const ProjectTitleFromId = ({ helia, heliaOnline, projectId }: ProjectTitleFromIdProps) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    const init = async () => {
      console.log("Initializing project title");
      console.log(heliaOnline);
      if (title.length > 0) return;
      if (!heliaOnline) return;
      const j = json(helia);
      const cid = CID.parse(projectId);
      console.log("Before get");
      // @ts-ignore
      const data = await j.get(cid);
      console.log("After:", data);
      // @ts-ignore
      setTitle(data.title);
    };
    init();
  }, [title, helia, heliaOnline, projectId]);
  return <span>{title}</span>;
};
