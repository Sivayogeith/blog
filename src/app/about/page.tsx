export default async function About() {
  return (
    <div className="flex flex-col items-center w-full text-start justify-center h-[84vh]">
      <div className="max-w-160 flex flex-col items-center gap-2 p-4">
        <h1 className="text-4xl font-bold">About Sage's Blog</h1>
        <p>
          This blog is my hopefully 180 hours project on Macondo - Hack Club for
          a Macbook Air! I have spent over 3 months on this project - 3 months
          of daily coding - and to be honest, it wasn't hard and the Macbook
          being the goal filled me with enough motivation.
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
      </div>
    </div>
  );
}
