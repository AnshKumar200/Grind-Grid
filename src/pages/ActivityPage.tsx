import { useState } from "react";

type DataActivity = {
    date: string;
    total: number;
    platforms: {
        github?: number;
        leetcode?: number;
    };
};

export default function ActivityPage() {
    const [leetcodeUN, setLeetcodeUN] = useState('');
    const [githubUN, setGithubUN] = useState('');
    const [timeline, setTimeline] = useState<DataActivity[]>();

    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const userData = new Map<string, DataActivity>();
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        userData.set(key, {
            date: key,
            total: 0,
            platforms: {
                github: 0,
                leetcode: 0,
            },
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch('http://localhost:7878/activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leetcode: leetcodeUN, github: githubUN })
        })

        const data = await res.json()

        if (data.github) {
            data.github.days.forEach(d => {
                const entry = userData.get(d.date);
                if (!entry) return;

                entry.platforms.github = d.count;
                entry.total += d.count;
            })
        }
        if (data.leetcode) {
            data.leetcode.days.forEach(d => {
                const entry = userData.get(d.date);
                if (!entry) return;

                entry.platforms.leetcode = d.count;
                entry.total += d.count;
            })
        }
        setTimeline(Array.from(userData.values()))
    }

    return (
        <div>
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
                <div>
                    {timeline.map((item, key) => (
                        <div>{item.total}</div>
                    ))}
                </div>
            )}
        </div>
    )
}
