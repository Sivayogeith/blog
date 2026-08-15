export default async function Footer() {
  return (
    <footer className="flex justify-between mt-5 py-5 px-8 border-t border-secondary">
      <p>© Copyright themeowingsage {new Date().getFullYear()}</p>
      <a className="text-secondary" href="/about">
        About
      </a>
    </footer>
  );
}
