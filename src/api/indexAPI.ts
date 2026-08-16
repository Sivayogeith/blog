import { get, MacondoProject } from "./helper";

export const getTotalTime = async () => {
  const result = await get("/totalTime");
  if (result.ok) {
    return parseInt(await result.text());
  }
  return 0;
};

export const getMacondoProject = async (): Promise<MacondoProject> => {
  const result = await get("/macondoProject");
  return result.json();
};
