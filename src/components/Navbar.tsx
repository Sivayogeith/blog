import { getMe } from "@/src/api/authAPI";
import Dropdown from "./Dropdown";
import ThemeButton from "./ThemeButton";
import { matchesRoute } from "../proxy";
import { hideNavbarRoutes } from "../utils/dropdownUtils";
import { headers } from "next/headers";

export default async function Navbar() {
  const session = await getMe();
  const header = await headers()

  return (
    <div className="py-5 md:px-5 px-2 flex w-full justify-center items-center sm:flex-row flex-col">
      <div className="md:w-full"></div>
      <a
        className="md:text-center sm:text-start text-center md:text-3xl text-2xl w-full"
        href="/"
      >
        Sage's Blog
      </a>
      <div className="flex justify-end text-xl items-center gap-2 md:w-full md:m-0 mt-2">
        {session.userId ? (
          <Dropdown itemsId={"admin"} session={session} />
        ) : (
          <>
            {!matchesRoute(header.get('x-path') || "", hideNavbarRoutes) && (
              <div className="my-2">
                <a href="/register" className="me-4 nav-link">
                  Register
                </a>
                <a href="/login" className="me-2 nav-link">
                  Login
                </a>
              </div>
            )}
            <ThemeButton />
          </>
        )}
      </div>
    </div>
  );
}
