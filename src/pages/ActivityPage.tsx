// themes
// size
// skyscrapers, small colorful pyramids, trees?, :w - a new comp

import { useState } from "react";
import testdata from '../data.json'
import { SiGithub, SiLeetcode } from "react-icons/si";

type DataActivity = {
    date: string;
    total: number;
    platforms: {
        github: number;
        leetcode: number;
    };
};

function getColor(count: number) {
    if (count === 0) return 'bg-[#f3e8ff]';
    if (count < 3) return 'bg-[#d8b4fe]';
    if (count < 6) return 'bg-[#c084fc]';
    if (count < 10) return 'bg-[#9333ea]';
    return 'bg-[#6b21a8]';
};

export default function ActivityPage() {
    const [leetcodeUN, setLeetcodeUN] = useState('');
    const [githubUN, setGithubUN] = useState('');
    const [timeline, setTimeline] = useState<(DataActivity | null)[]>(testdata);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params = new URLSearchParams();
        if (githubUN) params.append('github', githubUN)
        if (leetcodeUN) params.append('leetcode', leetcodeUN)

        const res = await fetch(`http://localhost:7878/activity?${params.toString()}`)
        const data = await res.json()

        setTimeline(data)
    }

    return (
        <div className="flex flex-col items-center">
            <form onSubmit={handleSubmit}>
                <label>
                    Leetcode:
                    <input type="text" value={leetcodeUN} onChange={(e) => setLeetcodeUN(e.target.value)} />
                </label>
                <label>
                    Github:
                    <input type="text" value={githubUN} onChange={(e) => setGithubUN(e.target.value)} />
                </label>
                <button type="submit">Go!</button>
            </form>

            {timeline && (
                <div className="grid grid-flow-col grid-rows-7 w-fit gap-1 font-outfit font-medium">
                    {timeline.map((item, i) =>
                        item ? (
                            <div className="group flex">
                                <div key={i} className={`size-6 ${getColor(item.total)} border border-[#b794f4]/35 hover:scale-125 rounded-sm duration-200 ease-out`} />
                                <div className="hidden group-hover:flex group-hover:flex-col absolute text-nowrap pointer-events-none bg-[#2a1f45] text-[#f5f3ff] text-sm p-1 rounded-sm justify-center translate-x-6 z-1">
                                    <div>
                                        {new Date(item.date).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: '2-digit',
                                        })}
                                    </div>
                                    <div className="flex gap-1">
                                        {item.platforms.github > 0 && <div className="flex gap-1 items-center ">
                                            <SiGithub />: {item.platforms.github}
                                        </div>}
                                        {item.platforms.leetcode > 0 && <div className="flex gap-1 items-center ">
                                            <SiLeetcode />: {item.platforms.leetcode}
                                        </div>}
                                    </div>
                                </div>
                                {/*   <Pyramid count={item.total} />*/}
                            </div>
                        ) : (
                            <div key={i} className="size-6 border border-[#b794f4]/65 rounded-sm">
                                {/*   <Pyramid count={0} />*/}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}
