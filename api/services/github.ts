import { Octokit } from "octokit";
import dotenv from 'dotenv';
dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

export async function githubActivity(username: String) {
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

    return {
        username,
        total: result.user.contributionsCollection.contributionCalendar.totalContributions,
        days,
    };
}
