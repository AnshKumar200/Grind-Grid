import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
    return (
        <div className="text-2xl min-h-screen flex flex-col font-outfit p-4">
            <div className="flex justify-center z-2">
                <Navbar />
            </div>
            <div className="flex-1 flex flex-col">
                <Outlet />
            </div>
            <div className="z-2">
                <Footer />
            </div>
        </div>
    )
}

export default App;
