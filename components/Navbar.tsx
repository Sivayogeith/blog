import { getMe } from "@/app/api/authAPI";

export default async function Navbar() {
  const session = await getMe();

  return (
    <div className="p-5 flex w-full justify-center items-center">
      <div className="md:w-full"></div>
      <a className="md:text-center md:text-3xl text-2xl w-full" href="/">Sage's Blog</a>
      <a className="text-xl text-end w-full" href="/dashboard">
        {session.username}
      </a>
    </div>
  );
}
