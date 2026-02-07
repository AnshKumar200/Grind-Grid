
export async function leetcodeActivity(username: String) {
    const query = `
            query userProfileCalendar($username: String!, $year: Int) {
                matchedUser(username: $username) {
                    userCalendar(year: $year) {
                        submissionCalendar
                    }
                }
            }
        `;

    const getData = async (year: number) => {
        const result = await fetch('https://leetcode.com/graphql', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com",
                "User-Agent": "Mozilla/5.0",
            },
            body: JSON.stringify({
                query,
                variables: {
                    username,
                    year,
                },
            }),
        })
        const data = await result.json()
        const parsed = JSON.parse(data?.data?.matchedUser?.userCalendar?.submissionCalendar || '{}');
        return parsed;
    }

    const now = new Date()
    const currY = now.getFullYear()
    const lastY = currY - 1;

    const [curr, last] = await Promise.all([
        getData(currY),
        getData(lastY)
    ])

    const merged = { ...last, ...curr };
    const oneYearAgo = new Date(now)
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const days = Object.entries(merged)
        .map(([ts, count]) => ({
            date: new Date(Number(ts) * 1000),
            count: Number(count),
        }))
        .filter(d => d.date >= oneYearAgo && d.date <= now)
        .map(d => ({
            date: d.date.toISOString().slice(0, 10),
            count: d.count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    const total = days.reduce((sum, d) => sum + d.count, 0);

    return {
        username,
        total,
        days,
    }
}
