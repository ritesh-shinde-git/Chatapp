const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.KEY
});

app.post("/ask", async (req, res) => {

    try {

        const { question } = req.body;

        if (!question) {
            return res.status(400).send({
                _status: false,
                _message: "Question is required"
            });
        }

        console.log("Question:", question);

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: question
        });

        const finalData = response.text;

        console.log("Gemini response received");

        res.send({
            _status: true,
            _message: "Content Found..",
            finalData: finalData
        });

    } catch (error) {

        console.log("Gemini Error:", error.message);

        res.status(500).send({
            _status: false,
            _message: "Unable to generate content",
            error: error.message
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server Start on port ${process.env.PORT}`);
});