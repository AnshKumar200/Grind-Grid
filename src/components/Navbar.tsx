import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="flex gap-6 bg-gray-300 w-fit md:px-6 py-2 rounded-2xl items-center max-md:text-lg px-4">
            <Link to="/"><img src="/logo.png" className="object-cover size-10 md:size-12" /></Link>
            <a href="https://github.com/AnshKumar200/Grind-Grid" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-6 decoration-dashed decoration-2">Documentation</a>
            <a href="https://0xansh.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-6 decoration-dashed decoration-2">Contact Me :)</a>
        </div >
    )
}
