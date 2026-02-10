import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { githubActivity } from "./services/github.js"
import { leetcodeActivity } from "./services/leetcode.js";
dotenv.config();

const PORT = process.env.PORT || '7878';

const app = express()
app.use(express.json())
app.use(cors())


app.get('/activity', async (req, res) => {
    const { github, leetcode } = req.query;

    if (!github && !leetcode) {
        return res.status(400).json({
            error: 'at least one username is req'
        })
    }

    try {
        let gh: any = null;
        let lh: any = null;

        const promise = [];

        if (github && typeof github === "string") {
            promise.push(githubActivity(github).then(data => gh = data))
        }
        if (leetcode && typeof leetcode === "string") {
            promise.push(leetcodeActivity(leetcode).then(data => lh = data))
        }

        await Promise.all(promise);

        const today = new Date()
        const oneYearAgo = new Date(today)
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const map = new Map<string, {
            date: string;
            total: number;
            platforms: {
                github: number;
                leetcode: number;
            };
        }>();

        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const key = d.toISOString().slice(0, 10)
            map.set(key, {
                date: key,
                total: 0,
                platforms: {
                    github: 0,
                    leetcode: 0,
                }
            })
        }

        if (gh) {
            gh.days.forEach((d: any) => {
                const entry = map.get(d.date);
                if (!entry) return;

                entry.platforms.github = d.count;
                entry.total += d.count;
            })
        }
        if (lh) {
            lh.days.forEach((d: any) => {
                const entry = map.get(d.date);
                if (!entry) return;

                entry.platforms.leetcode = d.count;
                entry.total += d.count;
            })
        }

        const timeline = Array.from(map.values());

        res.status(200).json(timeline)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'failed to get activity'
        })
    }
})

app.get('/heatmap', async (req, res) => {
    const { github, leetcode } = req.query;

    if (!github && !leetcode) {
        return res.status(400).json({
            error: 'at least one username is req'
        })
    }

    try {
        let gh: any = null;
        let lh: any = null;

        const promise = [];

        if (github && typeof github === "string") {
            promise.push(githubActivity(github).then(data => gh = data))
        }
        if (leetcode && typeof leetcode === "string") {
            promise.push(leetcodeActivity(leetcode).then(data => lh = data))
        }

        await Promise.all(promise);

        const today = new Date()
        const oneYearAgo = new Date(today)
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const map = new Map<string, number>();

        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const key = d.toISOString().slice(0, 10)
            map.set(key, 0);
        };

        if (gh) {
            gh.days.forEach((d: any) => {
                map.set(d.date, (map.get(d.date) || 0) + d.count);
            })
        }
        if (lh) {
            lh.days.forEach((d: any) => {
                map.set(d.date, (map.get(d.date) || 0) + d.count);
            })
        }

        const days = Array.from(map.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date))

        const size = 10;
        const gap = 2;

        function getColor(count: number) {
            if (count === 0) return '#f3e8ff';
            if (count < 3) return '#d8b4fe';
            if (count < 6) return '#c084fc';
            if (count < 10) return '#9333ea';
            return '#6b21a8';
        }

        const rects = days.map((d, i) => {
            const week = Math.floor(i / 7);
            const day = i % 7;

            const x = week * (size + gap);
            const y = day * (size + gap);

            return `
                <rect 
                    x="${x}" 
                    y="${y}" 
                    width="${size}" 
                    height="${size}" 
                    rx="2"
                    fill="${getColor(d.count)}"
                >
                </rect>
            `;
        }).join('');

        const width = Math.ceil(days.length / 7) * (size + gap);
        const height = 7 * (size + gap);

        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                ${rects}
            </svg>
        `;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'failed to generate heatmap'
        })
    }
})

app.listen(PORT, () => {
    console.log('Server is listening on:', PORT)
})
