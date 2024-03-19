require('dotenv').config();

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

async function get_answer(prompt: string) {
  console.log("get ans function 1234");
  console.log(prompt);
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: `
      you are a white blood cell defending the human body. a bacteria has invaded.
      i will provide what the bacteria says and you must respond` },
      { role: 'user', content: prompt },
    ]
  });

  return response.choices[0].message.content;
}

export default get_answer;