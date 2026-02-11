import { Link } from "react-router-dom";
import CubeAni from "../components/CubeAni";
import GridEffect from "../components/GridEffect";
import { IoIosArrowForward } from "react-icons/io";

export default function HomePage() {
    return (
        <div className="flex-1 flex flex-col justify-center p-30">
            <GridEffect />
            <div className="w-full flex flex-col gap-9 z-4">
                <div>
                    <div className="absolute -translate-y-7 left-0">
                        <CubeAni dir="lr" />
                    </div>
                    <div className="text-8xl">Grind Grid</div>
                    <div className="absolute translate-y-2 left-0">
                        <CubeAni dir="rl" />
                    </div>
                    <div className="absolute top-0 left-25">
                        <CubeAni dir="tb" />
                    </div>
                    <div className="absolute top-0 left-150">
                        <CubeAni dir="bt" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-5xl">Your Coding Activity,</div>
                    <div className="text-5xl">Beautifully Visualized</div>
                </div>
                <Link to='activity' className="p-4 bg-gray-300 w-fit rounded-xl text-3xl flex gap-3 items-center">
                    <div>Get your heatmap!</div>
                    <IoIosArrowForward />
                </Link>
                <div className="absolute left-0 translate-y-87">
                    <CubeAni dir="rl" />
                </div>
            </div>
        </div>
    )
}
