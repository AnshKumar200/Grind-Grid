import express from "express";
import cors from 'cors';
import { Octokit } from "octokit";
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || '7878';
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

const app = express()
app.use(cors())

app.get('/github/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const query = `
            query($username: String!) {
                user(login: $username) {
                    contributionsCollection {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    date
                                    contributionCount
                                }
                            }
                        }
                    }
                }
            }
        `;

        const result: any = await octokit.graphql(query, {
            username,
        })

        const days = result.user.contributionsCollection.contributionCalendar.weeks
            .flatMap((week: any) => week.contributionDays)
            .map((day: any) => ({
                date: day.date,
                count: day.contributionCount,
        }));

        res.status(200).json({
            username,
            total: result.user.contributionsCollection.contributionCalendar.totalContributions,
            days,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to get github contributions'
        });
    }
})

app.listen(PORT, () => {
    console.log('Server is listening on:', PORT)
})
