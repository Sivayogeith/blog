import {
  getMacondoProject,
  getHackatime,
  getCommits,
} from "@/src/api/indexAPI";
import {
  differenceInDays,
  differenceInHours,
  Duration,
  intervalToDuration,
} from "date-fns";

export const metadata = {
  title: "About",
  description: "About Sage's Blog project",
};

const GOAL_HOURS = 200;
const END_DATE = new Date("2026-09-01");
const MULT = 50;

export default async function About() {
  const totalSeconds = await getHackatime();
  const totalHours = differenceInHours(totalSeconds * 1000, 0);

  const totalSecondsToday = await getHackatime(true);
  const todayWork = intervalToDuration({
    start: 0,
    end: totalSecondsToday * 1000,
  });
  const durationToString = (d: Duration) =>
    `${d.hours ? d.hours + " hours" : ""} ${d.minutes ? d.minutes + " mins" : ""}`;

  const macondoProject = await getMacondoProject();

  const daysTillEnd = differenceInDays(END_DATE, Date.now());
  const streakGoal = daysTillEnd + macondoProject.project_streak_days;

  const dailyGoal = intervalToDuration({
    start: 0,
    end: ((GOAL_HOURS - totalHours) / daysTillEnd) * 60 * 60 * 1000,
  });

  const commitsCount = await getCommits();

  return (
    <div className="flex flex-col items-center w-full text-start justify-center h-[84vh]">
      <div className="max-w-160 flex flex-col items-center gap-2 p-4">
        <h1 className="text-4xl font-bold">About Sage's Blog</h1>
        <p>
          This blog is my
          <span className="ms-1 font-bold">{totalHours} hours</span> project on
          <a href="https://macondo.hackclub.com" className="text-secondary">Macondo</a>, a <a href="https://hackclub.com" className="text-secondary">Hack Club</a> YSWS Program for a Macbook Air! I have spent over{" "}
          <span className="font-bold">
            {macondoProject.project_streak_days} days
          </span>{" "}
          on this project - {macondoProject.project_streak_days} days of daily
          coding - and while some days were easy, some were filled with misery and on those days the goal of a Macbook filled me with enough motivation.
        </p>
        <p className="text-xl mt-2">Project Links:</p>
        <div className="w-fit text-start text-xl">
          <ul className="list-disc [&_a]:text-secondary">
            <li>
              <a href="https://github.com/Sivayogeith/blog">
                Github - Frontend
              </a>
            </li>
            <li>
              <a href="https://github.com/Sivayogeith/blog-api">
                Github - Backend
              </a>
            </li>
            <li>
              <a href="https://macondo.hackclub.com/projects/7775">Macondo</a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col w-full">
          <h1 className="text-2xl">Stats</h1>
          <hr className="text-secondary w-full mb-3" />
          <div className="h-6 w-full bg-light rounded-lg relative text-center">
            <span className="absolute inset-0 text-white font-semibold">{`${totalHours} / ${GOAL_HOURS} hours`}</span>
            <div
              className="h-full bg-deep-light rounded-s-lg"
              style={{
                width: Math.round((totalHours / GOAL_HOURS) * 100) + "%",
              }}
            ></div>
          </div>
          <p className="text-lg mt-2 text-center">
            Estimated Gold: ({MULT} <span className="text-sm">(Level 3)</span> ×{" "}
            {(1 + streakGoal * 0.01).toPrecision(3)}{" "}
            <span className="text-sm">(streak bonus)</span>) × {totalHours}{" "}
            <span className="text-sm">hours</span> ={" "}
            {Math.round(MULT * (1 + streakGoal * 0.01) * totalHours)} 🪙
          </p>
          <p className="text-lg mt-1 text-center">
            Today's Progress:{" "}
            <span
              className={`font-semibold ${totalSecondsToday > ((GOAL_HOURS - totalHours) / daysTillEnd) * 60 * 60 ? "dark:text-green-300 text-green-700" : "dark:text-red-400 text-red-700"}`}
            >
              {durationToString(todayWork)} / {durationToString(dailyGoal)}
            </span>{" "}
            -{" "}
            <span
              className={
                macondoProject.streakStatus == "active"
                  ? "dark:text-green-300 text-green-700"
                  : "dark:text-red-400 text-red-700"
              }
            >
              {macondoProject.streakStatus[0].toUpperCase() +
                macondoProject.streakStatus.slice(1)}{" "}
              Streak
            </span>
          </p>
          <p className="text-lg mt-1 text-center">
            Total Commits: {commitsCount.blog}{" "}
            <span className="text-sm">frontend</span> + {commitsCount.blogAPI}{" "}
            <span className="text-sm">backend</span> ={" "}
            <span className="font-semibold">{commitsCount.blog + commitsCount.blogAPI} Commits</span>
          </p>
        </div>
      </div>
    </div>
  );
}
