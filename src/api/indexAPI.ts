"use server"

import { startOfDay } from "date-fns";
import { get, MacondoProject } from "./helper";

export const getHackatime = async (today: boolean = false) => {
  const result = await get(
    `/totalTime${today ? `?start=${startOfDay(new Date()).toISOString()}` : ""}`,
  );
  if (result.ok) {
    return parseInt(await result.text());
  }
  return 0;
};

export const getMacondoProject = async (): Promise<MacondoProject> => {
  const result = await get("/macondoProject");
  return result.json();
};

export const getCommits = async (): Promise<{
  blog: { count: number; last: any };
  blogAPI: { count: number; last: any };
}> => {
  const result = await get("/commitsData");
  return await result.json();
};
