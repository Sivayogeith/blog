import { getMe } from "@/src/api/authAPI";
import { getUsers } from "@/src/api/ownerAPI";

export default async function Users() {
  const users = await getUsers();
  const session = await getMe();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="m-5 md:w-[95vw] w-[90vw] h-full flex justify-between flex-col">
        <p className="text-2xl">All Users</p>
        <hr className="dark:text-lightest text-dark" />
      </div>
      <div className="px-10 w-full">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Username</th>
              <th>Image</th>
              <th>Admin?</th>
              <th>Owner?</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <a href={`/user/${user.username}`} className="dark:text-lighter text-dark">#{user.id}</a>
                </td>
                <td>
                  {user.name}{" "}
                  <span className="font-semibold">
                    {user.username == session.username && "(you)"}
                  </span>
                </td>
                <td>{user.username}</td>
                <td className="flex justify-center">
                  <img className="size-10 rounded-full" src={user.image} />
                </td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>
                <td>{user.isOwner ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
