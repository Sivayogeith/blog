"use server"

import { startOfDay } from "date-fns";
import { get, MacondoProject } from "./helper";

export const getHackatime = async (today: boolean = false) => {
  const response = await get(
    `/totalTime${today ? `?start=${startOfDay(new Date()).toISOString()}` : ""}`,
  );
  if (response.ok) {
    return parseInt(await response.text());
  }
  return 0;
};

export const getMacondoProject = async (): Promise<MacondoProject> => {
  const response = await get("/macondoProject");
  return response.json();
};

export const getCommits = async (): Promise<{
  blog: { count: number; last: any };
  blogAPI: { count: number; last: any };
}> => {
  const response = await get("/commitsData");
  return await response.json();
};