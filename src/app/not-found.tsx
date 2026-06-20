export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <div className="border border-secondary px-15 pt-15 pb-4 rounded-xl text-center">
        <h2 className="mb-2 text-5xl">Not Found</h2>
        <p className="text-2xl mb-10">Could not find requested resource</p>
        <a href="/" className="text-lg text-secondary">
          Return Home
        </a>
      </div>
    </div>
  );
}
