import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { githubActivity } from "./services/github.js"
import { leetcodeActivity } from "./services/leetcode.js";
dotenv.config();

const PORT = process.env.PORT || '7878';

const app = express()
app.use(cors())

app.get('/activity', async (req, res) => {
    const { github, leetcode } = req.query;

    try {
        const response: any = {};
        const promise = [];

        if(github && typeof github === 'string') {
            promise.push(githubActivity(github).then((data) => {
                response.gihub = data;
            }))
        }

        if(leetcode && typeof leetcode === 'string') {
            promise.push(leetcodeActivity(leetcode).then((data) => {
                response.leetcode = data;
            }))
        }
        
        await Promise.all(promise);
        res.status(200).json(response)
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: 'failed to get activity'
        })
    }
})

app.listen(PORT, () => {
    console.log('Server is listening on:', PORT)
})
