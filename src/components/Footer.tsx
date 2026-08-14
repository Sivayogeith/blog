export default async function Footer (){
    return <footer className="flex justify-between mt-5 p-5 border-t border-secondary">
        <p>© Copyright themeowingsage {new Date().getFullYear()}</p>
    </footer>
}