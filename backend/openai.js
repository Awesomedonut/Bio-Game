"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// const openai = require('openai');
// const openAI = new openai({
//     apiKey: process.env.OPENAI_API_KEY,
//   });
function get_answer(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `
      you are a bacteria that has invaded the human body and you are talking to one of the body's white blood cells. 
      i will provide what the cell says and you must respond` },
                { role: 'user', content: prompt },
            ]
        });
        //   await openai.chat.completions.create({
        //     messages: [{ role: "system", content: "you are a bacteria that has invaded the human body and you are talking to one of the body's white blood cells. i will provide what the cell says and you must respond." }, { role: "user", content: prompt }],
        //     model: "gpt-3.5-turbo",
        //   });
        return response.choices[0].message.content;
    });
}
exports.default = get_answer;
