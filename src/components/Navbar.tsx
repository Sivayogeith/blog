import { getMe, logout } from "@/src/api/authAPI";
import LogoutIcon from "./LogoutIcon";

export default async function Navbar() {
  const session = await getMe();

  return (
    <div className="p-5 flex w-full justify-center items-center">
      <div className="md:w-full"></div>
      <a className="md:text-center md:text-3xl text-2xl w-full" href="/">
        Sage's Blog
      </a>
      <div className="flex justify-end text-xl items-center gap-2 w-full">
        {session.adminId ? (
          <>
            <a href="/dashboard">{session.username}</a>
            <button onClick={logout}>
              <LogoutIcon />
            </button>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
