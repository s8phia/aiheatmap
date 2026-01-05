import express from 'express'
import axios from 'axios'
const router = express.Router()

//reminder to input AI key to get ai to work later

const OPENROUTER_API_KEY =process.env.AI_KEY

router.post('/ai', async (res, req) => {
    try {
    const systemPrompt =  `in a well explained but also concise matter, explain why the tokens differ and why one is more important (or equivalent in importance) than the other`
    } catch (error){
        console.log('error communicating with API:',  error.response?.data || error.message)
        res.statusCode(500).send("Internal Server Error")
    }

})