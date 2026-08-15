import { get } from "./helper";

export const getTotalTime = async () => {
    const result = await get("/totalTime")
    if (result.ok) {
        return parseInt(await result.text())
    }
    return 0;
};
