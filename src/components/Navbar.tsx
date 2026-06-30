import { getMe } from "@/src/api/authAPI";
import Dropdown from "./Dropdown";
import ThemeButton from "./ThemeButton";

export default async function Navbar() {
  const session = await getMe();
  return (
    <div className="py-5 md:px-5 px-2 flex w-full justify-center items-center">
      <div className="md:w-full"></div>
      <a className="md:text-center md:text-3xl text-2xl w-full" href="/">
        Sage's Blog
      </a>
      <div className="flex justify-end text-xl items-center gap-2 md:w-full">
        {session.adminId ? <Dropdown itemsId={"admin"} session={session} /> : <ThemeButton />}
      </div>
    </div>
  );
}
