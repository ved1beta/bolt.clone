require("dotenv").config();
console.log(process.env.GEMINI_API_KEY)

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "./prompts";

const genAI = new GoogleGenerativeAI("AIzaSyCMJN_HqVPaHUEKeR_FfKxNwXhHcKXf-oE");

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