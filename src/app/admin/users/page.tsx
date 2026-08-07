import { getUsers } from "@/src/api/ownerAPI";

export default async function Users() {
  const users = await getUsers();
  return (
    <div className="p-10"> 
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
              <td>#{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td className="flex justify-center"><img className="size-10 rounded-full" src={user.image} /></td>
              <td>{user.isAdmin.toString()}</td>
              <td>{user.isOwner.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
