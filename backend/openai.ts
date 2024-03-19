require('dotenv').config();

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });






// const openai = require('openai');


// const openAI = new openai({
//     apiKey: process.env.OPENAI_API_KEY,
//   });


async function get_answer(prompt: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: `
      you are a white blood cell defending the human body. a bacteria has invaded.
      i will provide what the bacteria says and you must respond` },
      { role: 'user', content: prompt },
    ]
  });

  
//   await openai.chat.completions.create({
//     messages: [{ role: "system", content: "you are a bacteria that has invaded the human body and you are talking to one of the body's white blood cells. i will provide what the cell says and you must respond." }, { role: "user", content: prompt }],
//     model: "gpt-3.5-turbo",
//   });

  return response.choices[0].message.content;
}

export default get_answer;