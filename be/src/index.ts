require("dotenv").config();
console.log(process.env.GEMINI_API_KEY)

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCMJN_HqVPaHUEKeR_FfKxNwXhHcKXf-oE");

async function main() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "hoo to write my first reach app";
    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
        process.stdout.write(chunk.text());
    }
}
main();

