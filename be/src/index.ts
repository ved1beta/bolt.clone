require("dotenv").config();
console.log(process.env.GEMINI_API_KEY)
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BASE_PROMPT, getSystemPrompt } from './prompts';


const genAI = new GoogleGenerativeAI("AIzaSyCMJN_HqVPaHUEKeR_FfKxNwXhHcKXf-oE");

const app = express();
app.use(express.json());

const reactBasePrompt = "Create a comprehensive React application with modular components and best practices.";
const nodeBasePrompt = "Create a robust Node.js backend application with clean architecture.";

app.post("/template", async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Determine if this project should be a Node.js or React application. Only respond with 'node' or 'react'.";

        const result = await model.generateContent(prompt);
        const answer = result.response.text().trim().toLowerCase();

        if (answer === "react") {
            res.json({
                prompts: [
                    BASE_PROMPT, 
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`
                ],
                uiPrompts: [reactBasePrompt]
            });
            return;
        }

        if (answer === "node") {
            res.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`
                ],
                uiPrompts: [nodeBasePrompt]
            });
            return;
        }

        res.status(403).json({message: "Cannot determine project type"});
    } catch (error) {
        console.error("Error in /template endpoint:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

app.post("/chat", async (req, res) => {
    try {
        const { messages } = req.body;
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const geminiResult = await model.generateContent(
            messages.map((msg: {content: string}) => msg.content).join('\n')
        );

        res.json({
            response: geminiResult.response.text()
        });
    } catch (error) {
        console.error("Error in /chat endpoint:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});







    async function main() {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine system prompt with user prompt
    const systemPrompt = getSystemPrompt();
    const userPrompt = "create a todo app in react";
    const fullPrompt = `${systemPrompt}\n\nUser Request: ${userPrompt}`;

    try {
        const result = await model.generateContentStream(fullPrompt);
        
        process.stdout.write("Generating response...\n\n");
        
        for await (const chunk of result.stream) {
            process.stdout.write(chunk.text());
        }
    } catch (error) {
        console.error("Error generating content:", error);
    }
}
main().catch(console.error);