import {
  getUser,
  getUserComments,
  getUserPosts,
  getUserStats,
} from "@/src/api/userAPI";
import { convertDateToString } from "@/src/utils/postUtils";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getUser(username);

  return {
    title: `${user.name}'s Profile`,
    description: `The user page of ${user.name} with all their posts, comments and more!`,
    openGraph: {
      images: user.image,
    },
  };
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUser(username);
  const stats = await getUserStats(username);
  const comments = await getUserComments(username);
  const posts = await getUserPosts(username);

  if (!user.name) {
    return notFound();
  }

  return (
    <>
      <div className="flex py-4 px-8 justify-between md:flex-row flex-col items-center gap-5">
        <div className="flex gap-5">
          <Image
            src={user.image || "/default-user.png"}
            alt={`${user.name}'s Profile Picture`}
            width={128}
            height={128}
            loading="eager"
            unoptimized
            className="rounded-full border dark:border-lighter border-dark"
          />
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <h1 className="text-5xl">{user.name}</h1>
              {user.isOwner ? (
                <span className="py-1 px-2 rounded-full h-min border-2 border-secondary animate-rainbow bg-dark font-bold">
                  Owner
                </span>
              ) : (
                user.isAdmin && (
                  <span className="py-1 px-2 rounded-full h-min border-2 border-secondary">
                    Admin
                  </span>
                )
              )}
            </div>
            <div className="flex gap-2 items-center mt-1">
              <p className="text-xl opacity-75">@{user.username}</p>
              {user.slackId && (
                <a
                  className="text-secondary mt-0.5"
                  target="_blank"
                  href={`https://hackclub.enterprise.slack.com/team/${user.slackId}`}
                >
                  Slack ({user.slackId})
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-8 items-center justify-center pt-2 ">
          <div>
            <p className="w-full">Posts Authored</p>
            <p className="text-5xl mt-1 text-center">{stats.posts}</p>
          </div>
          <div>
            <p>Comments Made</p>
            <p className="text-5xl mt-1 text-center">{stats.comments}</p>
          </div>
        </div>
      </div>
      <hr className="text-secondary mb-2" />
      <div
        className={`grid ${user.isAdmin && "lg:grid-cols-2"} grid-cols-1 p-4 gap-10`}
      >
        {user.isAdmin && (
          <table className="table-auto">
            <caption className="caption-top mb-1">Posts</caption>
            <thead>
              <tr>
                <th>Title</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr className="text-center h-40">
                  <td className="border-r-0! pr-0! pl-20!">
                    This user hasn't made a post yet!
                  </td>
                  <td className="border-l-0! pl-0!"></td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <a
                        href={post.slug}
                        className="dark:text-lighter text-dark"
                      >
                        {post.title}
                      </a>
                    </td>
                    <td className="text-end">
                      {convertDateToString(post.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        <div className="flex flex-col items-center w-full">
          <table
            className={`table-auto ${!user.isAdmin ? "w-[50%]" : "w-full"}`}
          >
            <caption className="caption-top mb-1">Comments</caption>
            <thead>
              <tr>
                <th>Comment</th>
                <th>On</th>
              </tr>
            </thead>
            <tbody>
              {comments.length === 0 ? (
                <tr className="text-center h-40">
                  <td className="border-r-0! pr-0! pl-8!">
                    This user hasn't made a comment yet!
                  </td>
                  <td className="border-l-0! pl-0!"></td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>{comment.message}</td>
                    <td className="text-end">
                      <a
                        href={`/post/${comment.on}`}
                        className="dark:text-lighter text-dark"
                      >
                        #{comment.on}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
