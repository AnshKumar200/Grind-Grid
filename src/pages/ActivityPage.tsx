// themes
// size
// skyscrapers, small colorful pyramids, trees?, :w - a new comp

import { useRef, useState } from "react";
import { SiCodeforces, SiGithub, SiLeetcode } from "react-icons/si";
import GridEffect from "../components/GridEffect";
import ActivityGrid from "../components/ActivityGrid";
import emptydata from '../data.json'
import { IoCopyOutline } from "react-icons/io5";
import { Slide, toast, ToastContainer } from "react-toastify";
import { FaRegCircleCheck } from "react-icons/fa6";
import { BsActivity } from "react-icons/bs";

export type DataActivity = {
    date: string;
    total: number;
    platforms: {
        github: number;
        leetcode: number;
        codeforces: number;
    };
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ActivityPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [leetcodeUN, setLeetcodeUN] = useState('');
    const [githubUN, setGithubUN] = useState('');
    const [codeforcesUN, setCodeforcesUN] = useState('');
    const [timeline, setTimeline] = useState<(DataActivity | null)[]>(emptydata);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)

        const params = new URLSearchParams();
        if (githubUN) params.append('github', githubUN)
        if (leetcodeUN) params.append('leetcode', leetcodeUN)
        if (codeforcesUN) params.append('codeforces', codeforcesUN)

        const res = await fetch(`${BACKEND_URL}/activity?${params.toString()}`)
        const data = await res.json()

        setLoading(false)
        setTimeline(data)
    }

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const url = canvas.toDataURL("image/png");

        const a = document.createElement("a");
        a.href = url;
        a.download = "grind-grid.png";
        a.click();
    }

    const handleCopy = async () => {
        const params = new URLSearchParams();

        if (githubUN) params.append("github", githubUN);
        if (leetcodeUN) params.append("leetcode", leetcodeUN);
        if (codeforcesUN) params.append("codeforces", codeforcesUN);

        const url = `${BsActivity}/heatmap?${params.toString()}`;

        try {
            await navigator.clipboard.writeText(url);
            toast(
                <div className="flex gap-2 items-center text-black font-outfit">
                    <FaRegCircleCheck />
                    <div>Copied!</div>
                </div>
                , {
                    position: "bottom-center",
                    hideProgressBar: true,
                    closeOnClick: true,
                    transition: Slide,
                    autoClose: 1000,
                    closeButton: false,
                    className: 'p-0 border-2 border-gray-600',
                    style: { width: 'fit-content' }
                })
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }
    return (
        <div className="flex flex-col items-center gap-5">
            <ToastContainer />
            <GridEffect blink={false} />
            <form onSubmit={handleSubmit} className="z-1 flex gap-5 flex-wrap">
                <label className="flex gap-2 items-center">
                    <SiLeetcode />
                    <div>Leetcode:</div>
                    <input type="text" className="border-3 border-gray-400 rounded-lg focus:border-gray-700 p-1" value={leetcodeUN} onChange={(e) => setLeetcodeUN(e.target.value)} />
                </label>
                <label className="flex gap-2 items-center">
                    <SiGithub />
                    <div>Github:</div>
                    <input type="text" className="border-3 border-gray-400 rounded-lg focus:border-gray-700 p-1" value={githubUN} onChange={(e) => setGithubUN(e.target.value)} />
                </label>
                <label className="flex gap-2 items-center">
                    <SiCodeforces />
                    <div>Codeforces:</div>
                    <input type="text" className="border-3 border-gray-400 rounded-lg focus:border-gray-700 p-1" value={codeforcesUN} onChange={(e) => setCodeforcesUN(e.target.value)} />
                </label>
                <button type="submit" className="p-2 bg-gray-300 rounded-xl text-2xl cursor-pointer">Go!</button>
            </form>

            {loading && (
                <div className="z-1">Loading...</div>
            )}

            <ActivityGrid data={timeline} externalRef={canvasRef} />

            <div className="z-1 flex gap-5">
                <button className="p-2 bg-gray-300 rounded-xl text-2xl cursor-pointer" onClick={handleDownload}>Download as Image</button>
                <button className="p-2 bg-gray-300 rounded-xl text-2xl cursor-pointer flex gap-2 items-center" onClick={handleCopy}>
                    <IoCopyOutline />
                    <div>Copy Embebd Link</div>
                </button>
            </div>
        </div>
    )
}
