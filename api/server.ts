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


app.post('/activity', async (req, res) => {
    const { github, leetcode } = req.body;

    try {
        const response: any = {};
        const promise = [];

        if(github) {
            promise.push(githubActivity(github).then((data) => {
                response.github = data;
            }))
        }

        if(leetcode) {
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
