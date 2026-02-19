import { Link } from "react-router-dom";
import CubeAni from "../components/CubeAni";
import GridEffect from "../components/GridEffect";
import { IoIosArrowForward } from "react-icons/io";

export default function HomePage() {
    return (
        <div className="flex-1 flex flex-col justify-center md:p-30">
            <GridEffect blink={true} />
            <div className="w-full flex flex-col gap-9 z-4 max-md:items-center">
                <div>
                    <div className="absolute -translate-y-7 left-0 max-md:hidden">
                        <CubeAni dir="lr" />
                    </div>
                    <div className="text-6xl sm:text-7xl md:text-8xl">Grind Grid</div>
                    <div className="absolute translate-y-2 left-0 max-md:hidden">
                        <CubeAni dir="rl" />
                    </div>
                    <div className="absolute top-0 left-25 max-md:hidden">
                        <CubeAni dir="tb" />
                    </div>
                    <div className="absolute top-0 left-150 max-md:hidden">
                        <CubeAni dir="bt" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-3xl sm:text-4xl md:text-5xl">Your Coding Activity,</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl">Beautifully Visualized</div>
                </div>
                <Link to='activity' className="p-4 bg-gray-300 w-fit rounded-xl md:text-3xl flex gap-3 items-center text-2xl">
                    <div>Get your heatmap!</div>
                    <IoIosArrowForward />
                </Link>
                <div className="absolute left-0 translate-y-87 max-md:hidden">
                    <CubeAni dir="rl" />
                </div>
            </div>
        </div>
    )
}
